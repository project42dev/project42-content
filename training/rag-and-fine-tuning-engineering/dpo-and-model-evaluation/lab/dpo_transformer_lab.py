#!/usr/bin/env python3
"""Offline miniature causal-language-model SFT, DPO, and evaluation lab."""
import argparse
import copy
import csv
import hashlib
import io
import json
import math
import os
import platform
import random
import re
import sys
from collections import defaultdict
from pathlib import Path

import torch
import torch.nn as nn
import torch.nn.functional as F


def stable_json(value):
    return json.dumps(value, sort_keys=True, separators=(",", ":"), ensure_ascii=False)


def sha256_file(path):
    h = hashlib.sha256()
    with open(path, "rb") as f:
        for block in iter(lambda: f.read(65536), b""):
            h.update(block)
    return h.hexdigest()


def state_hash(model):
    h = hashlib.sha256()
    for name, tensor in sorted(model.state_dict().items()):
        t = tensor.detach().cpu().contiguous()
        h.update(name.encode())
        h.update(str(t.dtype).encode())
        h.update(str(tuple(t.shape)).encode())
        h.update(bytes(t.view(torch.uint8).reshape(-1).tolist()))
    return h.hexdigest()


def write_json(path, value):
    Path(path).parent.mkdir(parents=True, exist_ok=True)
    Path(path).write_text(json.dumps(value, indent=2, sort_keys=True) + "\n", encoding="utf-8")


def write_jsonl(path, rows):
    Path(path).parent.mkdir(parents=True, exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        for row in rows:
            f.write(stable_json(row) + "\n")


def generate_data(out, seed, train_n=240, id_n=40, shifted_n=40):
    rng = random.Random(seed)
    additions = [(a, b) for a in range(40) for b in range(40)]
    rng.shuffle(additions)

    def add_record(a, b, index):
        answer = a + b
        offset = (-3, -2, -1, 1, 2, 3)[index % 6]
        return {"prompt": f"Add {a} and {b}. Answer:", "chosen": f" {answer}\n", "rejected": f" {answer + offset}\n", "answer": answer, "distribution": "in_distribution"}

    train = [add_record(a, b, i) for i, (a, b) in enumerate(additions[:train_n])]
    heldout = [add_record(a, b, train_n + i) for i, (a, b) in enumerate(additions[train_n:train_n + id_n])]
    subtractions = [(a, b) for a in range(30, 70) for b in range(0, 30) if a >= b]
    rng.shuffle(subtractions)
    shifted = []
    for i, (a, b) in enumerate(subtractions[:shifted_n]):
        answer = a - b
        offset = (-3, -2, -1, 1, 2, 3)[i % 6]
        shifted.append({"prompt": f"Subtract {b} from {a}. Answer:", "chosen": f" {answer}\n", "rejected": f" {answer + offset}\n", "answer": answer, "distribution": "shifted"})
    paths = {"train": out / "data" / "train.jsonl", "heldout_id": out / "data" / "heldout_id.jsonl", "heldout_shifted": out / "data" / "heldout_shifted.jsonl"}
    for name, rows in (("train", train), ("heldout_id", heldout), ("heldout_shifted", shifted)):
        write_jsonl(paths[name], rows)
    return train, heldout, shifted, paths


class CharTokenizer:
    SPECIAL = ["<pad>", "<bos>", "<eos>", "<unk>"]

    def __init__(self, chars):
        self.tokens = self.SPECIAL + sorted(set(chars))
        self.stoi = {s: i for i, s in enumerate(self.tokens)}
        self.itos = {i: s for i, s in enumerate(self.tokens)}
        self.pad, self.bos, self.eos, self.unk = range(4)

    @classmethod
    def train(cls, rows):
        return cls("".join(r[k] for r in rows for k in ("prompt", "chosen", "rejected")))

    def encode_text(self, text):
        return [self.stoi.get(c, self.unk) for c in text]

    def sequence(self, prompt, completion, max_len):
        ids = [self.bos] + self.encode_text(prompt) + self.encode_text(completion) + [self.eos]
        if len(ids) > max_len + 1:
            raise ValueError(f"sequence has {len(ids)} tokens but max_len permits {max_len + 1}")
        prompt_boundary = 1 + len(self.encode_text(prompt))
        x, y = ids[:-1], ids[1:]
        mask = [1.0 if target_position >= prompt_boundary else 0.0 for target_position in range(1, len(ids))]
        if not any(mask):
            raise ValueError("completion-only mask is empty")
        return x, y, mask

    def prompt_ids(self, prompt, max_len):
        ids = [self.bos] + self.encode_text(prompt)
        if len(ids) > max_len:
            raise ValueError("prompt exceeds max_len")
        return ids

    def decode(self, ids):
        return "".join(self.itos.get(int(i), "") for i in ids if int(i) >= len(self.SPECIAL))

    def save(self, path):
        write_json(path, {"type": "character", "tokens": self.tokens})

    @classmethod
    def load(cls, path):
        obj = json.loads(Path(path).read_text(encoding="utf-8"))
        tok = cls([])
        tok.tokens = obj["tokens"]
        tok.stoi = {s: i for i, s in enumerate(tok.tokens)}
        tok.itos = {i: s for i, s in enumerate(tok.tokens)}
        tok.pad, tok.bos, tok.eos, tok.unk = range(4)
        return tok

    def __len__(self):
        return len(self.tokens)


class Block(nn.Module):
    def __init__(self, width, heads, ff):
        super().__init__()
        self.ln1 = nn.LayerNorm(width)
        self.attn = nn.MultiheadAttention(width, heads, dropout=0.0, batch_first=True)
        self.ln2 = nn.LayerNorm(width)
        self.ff = nn.Sequential(nn.Linear(width, ff), nn.GELU(), nn.Linear(ff, width))

    def forward(self, x, causal_mask, padding_mask):
        z = self.ln1(x)
        z, _ = self.attn(z, z, z, attn_mask=causal_mask, key_padding_mask=padding_mask, need_weights=False)
        x = x + z
        return x + self.ff(self.ln2(x))


class TinyCausalLM(nn.Module):
    def __init__(self, vocab, max_len=64, width=64, heads=4, layers=2, ff=128):
        super().__init__()
        self.config = {"vocab": vocab, "max_len": max_len, "width": width, "heads": heads, "layers": layers, "ff": ff}
        self.token = nn.Embedding(vocab, width)
        self.position = nn.Embedding(max_len, width)
        self.blocks = nn.ModuleList([Block(width, heads, ff) for _ in range(layers)])
        self.norm = nn.LayerNorm(width)
        self.head = nn.Linear(width, vocab, bias=False)
        self.head.weight = self.token.weight

    def forward(self, ids, padding_mask=None):
        b, t = ids.shape
        if t > self.config["max_len"]:
            raise ValueError("context exceeds model max_len")
        pos = torch.arange(t, device=ids.device)
        x = self.token(ids) + self.position(pos)[None, :, :]
        causal = torch.triu(torch.ones(t, t, dtype=torch.bool, device=ids.device), diagonal=1)
        for block in self.blocks:
            x = block(x, causal, padding_mask)
        return self.head(self.norm(x))


def collate(rows, tokenizer, max_len, completion_key):
    seqs = [tokenizer.sequence(r["prompt"], r[completion_key], max_len) for r in rows]
    length = max(len(s[0]) for s in seqs)
    x = torch.full((len(rows), length), tokenizer.pad, dtype=torch.long)
    y = torch.full((len(rows), length), tokenizer.pad, dtype=torch.long)
    m = torch.zeros((len(rows), length), dtype=torch.float32)
    for i, (xi, yi, mi) in enumerate(seqs):
        x[i, :len(xi)], y[i, :len(yi)], m[i, :len(mi)] = torch.tensor(xi), torch.tensor(yi), torch.tensor(mi)
    return x, y, m


def sequence_logps(model, batch):
    x, y, mask = batch
    logits = model(x, x.eq(0))
    token_logps = F.log_softmax(logits, dim=-1).gather(-1, y.unsqueeze(-1)).squeeze(-1)
    return (token_logps * mask).sum(1), mask.sum(1)


def validate_beta(beta):
    if not math.isfinite(beta) or beta <= 0:
        raise ValueError("beta must be finite and positive")


def dpo_values(policy_chosen, policy_rejected, ref_chosen, ref_rejected, beta):
    validate_beta(beta)
    chosen_reward = beta * (policy_chosen - ref_chosen)
    rejected_reward = beta * (policy_rejected - ref_rejected)
    margin = chosen_reward - rejected_reward
    return -F.logsigmoid(margin), chosen_reward, rejected_reward, margin


def negative_checks(train, heldout, shifted, tokenizer, model):
    train_prompts = {r["prompt"] for r in train}
    evaluation_prompts = {r["prompt"] for r in heldout + shifted}
    assert not train_prompts.intersection(evaluation_prompts), "prompt split overlap"
    assert len(train) >= 200 and len(train_prompts) == len(train), "training pairs must be distinct"
    x, y, mask = collate([train[0]], tokenizer, model.config["max_len"], "chosen")
    prompt_tokens = 1 + len(tokenizer.encode_text(train[0]["prompt"]))
    assert mask[0, :prompt_tokens - 1].sum().item() == 0, "prompt token leaked into completion mask"
    assert mask.sum().item() > 0, "empty completion mask"
    scalar = torch.tensor(0.37, requires_grad=True)
    identical_loss, _, _, _ = dpo_values(scalar, scalar, scalar.detach(), scalar.detach(), 0.1)
    identical_loss.backward()
    assert abs(identical_loss.item() - math.log(2)) < 1e-6, "identical-pair loss is not log(2)"
    assert abs(scalar.grad.item()) < 1e-8, "identical pair produced a gradient"
    chosen = torch.tensor(-1.0, requires_grad=True)
    rejected = torch.tensor(-1.0, requires_grad=True)
    loss, _, _, _ = dpo_values(chosen, rejected, torch.tensor(-1.0), torch.tensor(-1.0), 0.1)
    loss.backward()
    assert chosen.grad.item() < 0 and rejected.grad.item() > 0, "DPO gradient direction is wrong"
    for invalid in (float("nan"), float("inf"), 0.0, -0.1):
        try:
            validate_beta(invalid)
        except ValueError:
            pass
        else:
            raise AssertionError("nonfinite or nonpositive beta accepted")
    frozen = copy.deepcopy(model)
    for p in frozen.parameters():
        p.requires_grad_(False)
    before = state_hash(frozen)
    lp, _ = sequence_logps(frozen, (x, y, mask))
    assert not lp.requires_grad and all(p.grad is None for p in frozen.parameters())
    assert before == state_hash(frozen), "frozen reference changed during check"
    return {"prompt_split_overlap": "PASS", "distinct_train_pairs": "PASS", "completion_only_mask": "PASS", "identical_pair": "PASS", "nonfinite_beta": "PASS", "gradient_direction": "PASS", "reference_freeze": "PASS"}


def sampled_batch(rows, batch_size, seed, step):
    rng = random.Random(seed + step * 104729)
    return [rows[rng.randrange(len(rows))] for _ in range(batch_size)]


def checkpoint_state_hash(data):
    h = hashlib.sha256()
    for name, tensor in sorted(data["model"].items()):
        t = tensor.detach().cpu().contiguous()
        h.update(name.encode())
        h.update(str(t.dtype).encode())
        h.update(str(tuple(t.shape)).encode())
        h.update(bytes(t.view(torch.uint8).reshape(-1).tolist()))
    return h.hexdigest()


def inspect_checkpoint(path, binding, stage, target=None, exact_step=False, expected_extra=None):
    data = torch.load(path, map_location="cpu", weights_only=False)
    required = {"model", "config", "optimizer", "step", "extra"}
    if not isinstance(data, dict) or not required.issubset(data):
        raise ValueError(f"checkpoint format is invalid: {path}")
    if data["config"] != binding["model"]:
        raise ValueError(f"checkpoint model configuration is incompatible: {path}")
    extra = data.get("extra")
    if not isinstance(extra, dict) or extra.get("run_identity") != binding or extra.get("stage") != stage:
        raise ValueError(f"checkpoint identity or stage is incompatible: {path}")
    if expected_extra:
        for key, value in expected_extra.items():
            if extra.get(key) != value:
                raise ValueError(f"checkpoint {key} is incompatible: {path}")
    step = data["step"]
    if type(step) is not int or step < 0:
        raise ValueError(f"checkpoint step is not a nonnegative integer: {path}")
    if target is not None and target < step:
        raise ValueError(f"target step {target} is below saved step {step}: {path}")
    if exact_step and target is not None and target != step:
        raise ValueError(f"completed checkpoint step {step} does not equal requested target {target}: {path}")
    return data


def save_checkpoint(path, model, optimizer, step, binding, stage, extra=None):
    Path(path).parent.mkdir(parents=True, exist_ok=True)
    metadata = {"run_identity": binding, "stage": stage}
    metadata.update(extra or {})
    torch.save({"model": model.state_dict(), "config": model.config, "optimizer": optimizer.state_dict() if optimizer else None, "step": int(step), "extra": metadata}, path)


def load_checkpoint(path, binding, stage, model=None, optimizer=None, target=None, exact_step=False, expected_extra=None):
    data = inspect_checkpoint(path, binding, stage, target, exact_step, expected_extra)
    expected_config = binding["model"]
    if data["config"] != expected_config:
        raise ValueError(f"checkpoint model configuration is incompatible: {path}")
    if model is None:
        model = TinyCausalLM(**data["config"])
    elif model.config != data["config"]:
        raise ValueError(f"destination model configuration is incompatible: {path}")
    model.load_state_dict(data["model"])
    if optimizer is not None and data.get("optimizer") is not None:
        optimizer.load_state_dict(data["optimizer"])
    return model, int(data["step"]), data["extra"]


def train_sft(model, rows, tok, args, out, binding):
    path = out / "checkpoints" / "sft_resume.pt"
    opt = torch.optim.AdamW(model.parameters(), lr=args.lr)
    start = 0
    if args.resume and path.exists():
        model, start, _ = load_checkpoint(path, binding, "sft", model, opt, target=args.sft_steps)
    metrics_path = out / "metrics_sft.csv"
    mode = "a" if start and metrics_path.exists() else "w"
    with open(metrics_path, mode, newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=["step", "loss", "completion_tokens"])
        if mode == "w": writer.writeheader()
        for step in range(start, args.sft_steps):
            batch = collate(sampled_batch(rows, args.batch_size, args.seed, step), tok, args.max_len, "chosen")
            logps, counts = sequence_logps(model, batch)
            loss = -(logps.sum() / counts.sum())
            if not torch.isfinite(loss): raise FloatingPointError("nonfinite SFT loss")
            opt.zero_grad(set_to_none=True); loss.backward()
            assert all(p.grad is None or torch.isfinite(p.grad).all() for p in model.parameters()), "nonfinite SFT gradient"
            nn.utils.clip_grad_norm_(model.parameters(), 1.0); opt.step()
            writer.writerow({"step": step + 1, "loss": float(loss.detach()), "completion_tokens": int(counts.sum())}); f.flush()
            save_checkpoint(path, model, opt, step + 1, binding, "sft")
    save_checkpoint(out / "sft_reference.pt", model, None, args.sft_steps, binding, "sft")
    return model


def train_dpo(reference, rows, tok, beta, args, out, binding):
    validate_beta(beta)
    reference.eval()
    for p in reference.parameters():
        p.requires_grad_(False)
        p.grad = None
    policy = copy.deepcopy(reference)
    policy.train()
    for p in policy.parameters():
        p.requires_grad_(True)
        p.grad = None
    ref_before = state_hash(reference)
    policy_before = state_hash(policy)
    opt = torch.optim.AdamW(policy.parameters(), lr=args.lr)
    tag = str(beta).replace(".", "p")
    resume_path = out / "checkpoints" / f"dpo_beta_{tag}_resume.pt"
    start = 0
    if args.resume and resume_path.exists():
        policy, start, _ = load_checkpoint(resume_path, binding, "dpo", policy, opt, target=args.dpo_steps, expected_extra={"beta": beta, "reference_hash": ref_before})
    metrics_path = out / f"metrics_dpo_beta_{tag}.csv"
    fields = ["step", "loss", "logps_chosen", "logps_rejected", "rewards_chosen", "rewards_rejected", "rewards_margin", "rewards_accuracy", "gradient_norm"]
    mode = "a" if start and metrics_path.exists() else "w"
    with open(metrics_path, mode, newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fields)
        if mode == "w": writer.writeheader()
        for step in range(start, args.dpo_steps):
            selected = sampled_batch(rows, args.batch_size, args.seed + int(beta * 1000), step)
            chosen = collate(selected, tok, args.max_len, "chosen")
            rejected = collate(selected, tok, args.max_len, "rejected")
            pc, _ = sequence_logps(policy, chosen); pr, _ = sequence_logps(policy, rejected)
            with torch.no_grad(): rc, _ = sequence_logps(reference, chosen); rr, _ = sequence_logps(reference, rejected)
            losses, rew_c, rew_r, margins = dpo_values(pc, pr, rc, rr, beta)
            loss = losses.mean()
            if not torch.isfinite(loss): raise FloatingPointError("nonfinite DPO loss")
            opt.zero_grad(set_to_none=True); loss.backward()
            assert all(p.grad is None or torch.isfinite(p.grad).all() for p in policy.parameters()), "nonfinite DPO gradient"
            assert all(p.grad is None for p in reference.parameters()), "reference received gradients"
            grad_norm = float(nn.utils.clip_grad_norm_(policy.parameters(), 1.0)); opt.step()
            writer.writerow({"step": step + 1, "loss": float(loss.detach()), "logps_chosen": float(pc.mean().detach()), "logps_rejected": float(pr.mean().detach()), "rewards_chosen": float(rew_c.mean().detach()), "rewards_rejected": float(rew_r.mean().detach()), "rewards_margin": float(margins.mean().detach()), "rewards_accuracy": float((margins > 0).float().mean().detach()), "gradient_norm": grad_norm}); f.flush()
            save_checkpoint(resume_path, policy, opt, step + 1, binding, "dpo", {"beta": beta, "reference_hash": ref_before})
    ref_after = state_hash(reference)
    assert ref_before == ref_after, "reference parameters changed"
    final = out / f"policy_beta_{tag}.pt"
    save_checkpoint(final, policy, None, args.dpo_steps, binding, "dpo", {"beta": beta, "reference_hash": ref_before})
    return policy, {"beta": beta, "policy_before": policy_before, "policy_after": state_hash(policy), "reference_before": ref_before, "reference_after": ref_after, "reference_unchanged": ref_before == ref_after}


@torch.no_grad()
def generate(model, tok, prompt, temperature, seed, max_new):
    if not math.isfinite(temperature) or temperature <= 0: raise ValueError("temperature must be finite and positive")
    ids = tok.prompt_ids(prompt, model.config["max_len"])
    generated = []
    generator = torch.Generator(device="cpu").manual_seed(seed)
    model.eval()
    for _ in range(max_new):
        x = torch.tensor([ids], dtype=torch.long)
        logits = model(x)[0, -1] / temperature
        next_id = int(torch.multinomial(F.softmax(logits, dim=-1), 1, generator=generator))
        if next_id == tok.eos: break
        ids.append(next_id); generated.append(next_id)
        if len(ids) >= model.config["max_len"]: break
    return tok.decode(generated)


def rubric_score(text, expected):
    numbers = re.findall(r"-?\d+", text)
    return 1 if numbers and int(numbers[-1]) == int(expected) else 0


def judge_order(first_text, second_text, expected):
    first, second = rubric_score(first_text, expected), rubric_score(second_text, expected)
    return "first" if first > second else "second" if second > first else "tie"


def evaluate(reference, policies, heldout, shifted, tok, args, out):
    rows, human = [], []
    temperatures = [0.2, 0.8]
    for beta, policy in policies.items():
        for distribution, examples in (("in_distribution", heldout), ("shifted", shifted)):
            for temperature in temperatures:
                for i, example in enumerate(examples):
                    base_seed = args.seed * 100000 + int(beta * 1000) * 100 + int(temperature * 10) * 10 + i
                    policy_text = generate(policy, tok, example["prompt"], temperature, base_seed, args.max_new_tokens)
                    reference_text = generate(reference, tok, example["prompt"], temperature, base_seed + 1, args.max_new_tokens)
                    forward = judge_order(policy_text, reference_text, example["answer"])
                    reverse = judge_order(reference_text, policy_text, example["answer"])
                    forward_winner = "policy" if forward == "first" else "reference" if forward == "second" else "tie"
                    reverse_winner = "reference" if reverse == "first" else "policy" if reverse == "second" else "tie"
                    consistent = forward_winner == reverse_winner
                    verdict = forward_winner if consistent else "tie"
                    comparison_id = f"b{beta}-{distribution}-t{temperature}-{i}"
                    row = {"comparison_id": comparison_id, "beta": beta, "temperature": temperature, "seed": base_seed, "distribution": distribution, "prompt": example["prompt"], "expected_answer": example["answer"], "policy_output": policy_text, "reference_output": reference_text, "policy_length_chars": len(policy_text), "reference_length_chars": len(reference_text), "judge_policy_first": forward_winner, "judge_reference_first": reverse_winner, "swap_consistent": consistent, "verdict": verdict, "judge": "deterministic_exact_last_integer_v1"}
                    rows.append(row)
                    human.append({"comparison_id": comparison_id, "beta": beta, "temperature": temperature, "seed": base_seed, "distribution": distribution, "prompt": example["prompt"], "policy_output": policy_text, "reference_output": reference_text, "policy_first_human_label": "", "reference_first_human_label": "", "adjudicated_label": "", "reviewer_id": "", "notes": ""})
    write_jsonl(out / "generations.jsonl", rows)
    with open(out / "human_labels_pending.csv", "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=list(human[0])); writer.writeheader(); writer.writerows(human)
    groups = defaultdict(list)
    for row in rows: groups[(row["beta"], row["temperature"], row["distribution"])].append(row)
    summary = []
    for key, group in sorted(groups.items()):
        winners = [r["policy_length_chars"] for r in group if r["verdict"] == "policy"] + [r["reference_length_chars"] for r in group if r["verdict"] == "reference"]
        losers = [r["reference_length_chars"] for r in group if r["verdict"] == "policy"] + [r["policy_length_chars"] for r in group if r["verdict"] == "reference"]
        summary.append({"beta": key[0], "temperature": key[1], "distribution": key[2], "wins": sum(r["verdict"] == "policy" for r in group), "ties": sum(r["verdict"] == "tie" for r in group), "losses": sum(r["verdict"] == "reference" for r in group), "swap_consistency_rate": sum(r["swap_consistent"] for r in group) / len(group), "average_winner_length_chars": sum(winners) / len(winners) if winners else None, "average_loser_length_chars": sum(losers) / len(losers) if losers else None})
    write_json(out / "evaluation_summary.json", {"human_review_pending": True, "human_agreement": "UNKNOWN: complete human_labels_pending.csv to establish it", "groups": summary})


def build_manifest(out, data_paths):
    files = {}
    for path in sorted(out.rglob("*")):
        if path.is_file() and path.name != "manifest.json":
            files[str(path.relative_to(out))] = {"sha256": sha256_file(path), "bytes": path.stat().st_size}
    write_json(out / "manifest.json", {"algorithm": "sha256", "data_files": {k: str(v.relative_to(out)) for k, v in data_paths.items()}, "files": files})


def read_jsonl(path):
    with open(path, encoding="utf-8") as f:
        return [json.loads(line) for line in f if line.strip()]


def identity_payload(args, model_config, data_hashes, tokenizer_hash):
    return {
        "schema": "project42.dpo_run_identity.v1",
        "dataset": {"generator": "arithmetic_pairs_v1", "seed": args.seed, "train_n": 240, "heldout_id_n": 40, "heldout_shifted_n": 40, "sha256": data_hashes},
        "tokenizer": {"type": "character", "sha256": tokenizer_hash},
        "model": model_config,
        "training": {"batch_size": args.batch_size, "lr": args.lr, "sampling": "python_random_seed_plus_step_104729_v1"},
    }


def identity_digest(payload):
    return hashlib.sha256(stable_json(payload).encode("utf-8")).hexdigest()


def validate_existing_identity(out, args):
    identity_path = out / "run_identity.json"
    if not identity_path.exists():
        raise FileExistsError(f"existing artifacts have no run identity; use a new --out directory: {out}")
    stored = json.loads(identity_path.read_text(encoding="utf-8"))
    digest = stored.get("digest")
    payload = {k: v for k, v in stored.items() if k != "digest"}
    if digest != identity_digest(payload):
        raise ValueError("run_identity.json failed its self-digest check")
    expected_model = {"vocab": stored.get("model", {}).get("vocab"), "max_len": args.max_len, "width": args.width, "heads": args.heads, "layers": args.layers, "ff": args.ff}
    requested = identity_payload(args, expected_model, stored.get("dataset", {}).get("sha256"), stored.get("tokenizer", {}).get("sha256"))
    if payload != requested:
        raise ValueError("seed, tokenizer type, dataset specification, model, or training hyperparameters are incompatible with this run")
    paths = {"train": out / "data" / "train.jsonl", "heldout_id": out / "data" / "heldout_id.jsonl", "heldout_shifted": out / "data" / "heldout_shifted.jsonl"}
    for name, path in paths.items():
        if not path.is_file() or sha256_file(path) != payload["dataset"]["sha256"].get(name):
            raise ValueError(f"dataset is missing or tampered: {path}")
    tokenizer_path = out / "tokenizer.json"
    if not tokenizer_path.is_file() or sha256_file(tokenizer_path) != payload["tokenizer"]["sha256"]:
        raise ValueError(f"tokenizer is missing or tampered: {tokenizer_path}")
    return stored, paths


def prepare(args):
    torch.manual_seed(args.seed)
    torch.set_num_threads(args.threads)
    out = Path(args.out)
    identity_path = out / "run_identity.json"
    existing_files = out.exists() and any(path.is_file() for path in out.rglob("*"))
    if existing_files:
        identity, data_paths = validate_existing_identity(out, args)
        train = read_jsonl(data_paths["train"])
        heldout = read_jsonl(data_paths["heldout_id"])
        shifted = read_jsonl(data_paths["heldout_shifted"])
        tok = CharTokenizer.load(out / "tokenizer.json")
    else:
        out.mkdir(parents=True, exist_ok=True)
        train, heldout, shifted, data_paths = generate_data(out, args.seed)
        tok = CharTokenizer.train(train + heldout + shifted)
        tok.save(out / "tokenizer.json")
        model_config = {"vocab": len(tok), "max_len": args.max_len, "width": args.width, "heads": args.heads, "layers": args.layers, "ff": args.ff}
        payload = identity_payload(args, model_config, {name: sha256_file(path) for name, path in data_paths.items()}, sha256_file(out / "tokenizer.json"))
        identity = dict(payload, digest=identity_digest(payload))
        write_json(identity_path, identity)
    model = TinyCausalLM(**identity["model"])
    return out, train, heldout, shifted, data_paths, tok, model, identity


def preflight_stage(args, out, binding):
    stage = args.stage
    sft_resume = out / "checkpoints" / "sft_resume.pt"
    sft_final = out / "sft_reference.pt"
    dpo_paths = [out / "checkpoints" / f"dpo_beta_{str(beta).replace('.', 'p')}_resume.pt" for beta in (0.1, 0.5)]
    policy_paths = [out / f"policy_beta_{str(beta).replace('.', 'p')}.pt" for beta in (0.1, 0.5)]
    sft_extension = False
    if stage in ("all", "sft") and (sft_resume.exists() or sft_final.exists()):
        if not args.resume:
            raise FileExistsError("SFT artifacts exist; pass --resume with a compatible target or use a new --out directory")
        if not sft_resume.exists():
            raise FileNotFoundError("SFT final artifact exists but its resumable checkpoint is missing")
        saved = inspect_checkpoint(sft_resume, binding, "sft", target=args.sft_steps)
        if args.sft_steps > saved["step"]:
            if any(path.exists() for path in dpo_paths + policy_paths):
                raise ValueError("cannot extend SFT in a run that already has DPO artifacts; use a new --out directory")
            sft_extension = True
    reference_hash = None
    if stage in ("dpo", "eval"):
        if not sft_final.exists():
            raise FileNotFoundError("run the sft stage first")
        reference_data = inspect_checkpoint(sft_final, binding, "sft", target=args.sft_steps, exact_step=True)
        if reference_data["config"] != binding["model"]:
            raise ValueError("SFT model configuration is incompatible")
        reference_hash = checkpoint_state_hash(reference_data)
    if stage == "all" and sft_final.exists() and not sft_extension:
        reference_data = inspect_checkpoint(sft_final, binding, "sft", target=args.sft_steps, exact_step=True)
        reference_hash = checkpoint_state_hash(reference_data)
    if stage in ("all", "dpo"):
        for beta, resume_path, final_path in zip((0.1, 0.5), dpo_paths, policy_paths):
            if resume_path.exists() or final_path.exists():
                if not args.resume:
                    raise FileExistsError(f"DPO artifacts for beta {beta} exist; pass --resume or use a new --out directory")
                if not resume_path.exists():
                    raise FileNotFoundError(f"DPO final artifact for beta {beta} has no resumable checkpoint")
                if reference_hash is not None:
                    inspect_checkpoint(resume_path, binding, "dpo", target=args.dpo_steps, expected_extra={"beta": beta, "reference_hash": reference_hash})
    if stage == "eval":
        for beta, policy_path in zip((0.1, 0.5), policy_paths):
            if not policy_path.exists():
                raise FileNotFoundError(f"run DPO for beta {beta} first")
            inspect_checkpoint(policy_path, binding, "dpo", target=args.dpo_steps, exact_step=True, expected_extra={"beta": beta, "reference_hash": reference_hash})


def begin_attempt(out, args):
    path = out / "run_record.json"
    if path.exists():
        record = json.loads(path.read_text(encoding="utf-8"))
    else:
        record = {"schema": "project42.run_record.v2", "human_review_pending": True, "quality_claim": "miniature randomly initialized causal language model; no pretrained-model quality claim", "provenance": {"first_argv": sys.argv, "first_config": vars(args), "environment": {"python": platform.python_version(), "pytorch": torch.__version__, "platform": platform.platform(), "cpu_count_reported": os.cpu_count()}}, "attempts": []}
    attempt_id = len(record["attempts"]) + 1
    record["attempts"].append({"attempt_id": attempt_id, "stage": args.stage, "argv": sys.argv, "requested_sft_steps": args.sft_steps, "requested_dpo_steps": args.dpo_steps, "resume": args.resume, "status": "running"})
    write_json(path, record)
    return attempt_id


def finish_attempt(out, attempt_id, status, error=None):
    path = out / "run_record.json"
    record = json.loads(path.read_text(encoding="utf-8"))
    attempt = next(item for item in record["attempts"] if item["attempt_id"] == attempt_id)
    attempt["status"] = status
    if error is not None:
        attempt["error"] = {"type": type(error).__name__, "message": str(error)}
    write_json(path, record)


def main():
    p = argparse.ArgumentParser()
    p.add_argument("stage", nargs="?", choices=["all", "data", "checks", "sft", "dpo", "eval"], default="all")
    p.add_argument("--out", default="artifacts/run1"); p.add_argument("--seed", type=int, default=17)
    p.add_argument("--threads", type=int, default=2); p.add_argument("--max-len", type=int, default=64)
    p.add_argument("--width", type=int, default=64); p.add_argument("--heads", type=int, default=4)
    p.add_argument("--layers", type=int, default=2); p.add_argument("--ff", type=int, default=128)
    p.add_argument("--batch-size", type=int, default=16); p.add_argument("--sft-steps", type=int, default=80)
    p.add_argument("--dpo-steps", type=int, default=40); p.add_argument("--lr", type=float, default=0.001)
    p.add_argument("--max-new-tokens", type=int, default=8); p.add_argument("--resume", action="store_true")
    args = p.parse_args()
    if args.heads <= 0 or args.width <= 0 or args.width % args.heads: p.error("positive width must be divisible by positive heads")
    if args.layers <= 0 or args.ff <= 0 or args.max_len <= 0: p.error("layers, ff, and max-len must be positive")
    if args.batch_size <= 0: p.error("batch-size must be positive")
    if args.sft_steps < 0 or args.dpo_steps < 0: p.error("step targets must be nonnegative")
    if not math.isfinite(args.lr) or args.lr <= 0: p.error("lr must be finite and positive")
    if args.threads <= 0: p.error("threads must be positive")
    out, train, heldout, shifted, paths, tok, initial, binding = prepare(args)
    preflight_stage(args, out, binding)
    attempt_id = begin_attempt(out, args)
    try:
        if args.stage in ("all", "checks"):
            write_json(out / "negative_checks.json", negative_checks(train, heldout, shifted, tok, initial))
        reference = None
        policies, hashes = {}, []
        if args.stage not in ("data", "checks"):
            sft_file = out / "sft_reference.pt"
            if args.stage in ("all", "sft"):
                reference = train_sft(initial, train, tok, args, out, binding)
            else:
                reference, _, _ = load_checkpoint(sft_file, binding, "sft", target=args.sft_steps, exact_step=True)
            if args.stage in ("all", "dpo"):
                for beta in (0.1, 0.5):
                    policies[beta], record = train_dpo(reference, train, tok, beta, args, out, binding); hashes.append(record)
                write_json(out / "parameter_hashes.json", hashes)
            if args.stage in ("all", "eval"):
                reference_hash = state_hash(reference)
                for beta in (0.1, 0.5):
                    if beta not in policies:
                        tag = str(beta).replace(".", "p")
                        policies[beta], _, _ = load_checkpoint(out / f"policy_beta_{tag}.pt", binding, "dpo", target=args.dpo_steps, exact_step=True, expected_extra={"beta": beta, "reference_hash": reference_hash})
                evaluate(reference, policies, heldout, shifted, tok, args, out)
        finish_attempt(out, attempt_id, "completed")
        build_manifest(out, paths)
    except BaseException as error:
        finish_attempt(out, attempt_id, "failed", error)
        build_manifest(out, paths)
        raise


if __name__ == "__main__":
    main()
