# Miniature Transformer SFT, DPO, evaluation, and reporting lab

This lab trains a real causal transformer with PyTorch backpropagation on synthetic arithmetic preferences. The default experiment creates 240 training preference pairs, runs 80 supervised fine-tuning steps, and runs 40 Direct Preference Optimization steps at each of beta 0.1 and beta 0.5. It then evaluates both policies against the frozen SFT reference on held-out prompts.

The model is miniature and randomly initialized. It is not pretrained, does not establish general language quality, and is not a substitute for evaluating a production model.

DPO is a loss that uses offline preferences to fine-tune a language model without fitting a separate reward model. The method is described by Rafailov et al. at https://arxiv.org/abs/2305.18290. The loss and implicit-reward definitions used here follow the first-party TRL documentation at https://huggingface.co/docs/trl/en/dpo_trainer.

## Files and entry points

The supplied lab includes the core training program and its supporting data, checks, exercise, and documentation files. The executable training entry point is `dpo_transformer_lab.py`, not the optional checkpoint-adapter document.

Important files are:

* `dpo_transformer_lab.py`: data creation, checks, SFT, DPO, evaluation, checkpoints, and raw artifacts.
* `exercise.py`: standard-library DPO arithmetic exercise.
* `fixtures/worked_case.json` and `fixtures/worked_case.key.json`: fully traced pre-lab case.
* `fixtures/changed_input.json` and `fixtures/changed_input.key.json`: independent changed-input task and key.
* `report_results.py`: standard-library validation and summary generation, plus optional plotting.
* `fixtures/reporting_test.json` and `fixtures/reporting_test.key.json`: explicitly synthetic reporting test data and expected results.
* `test_exercise.py` and `test_report_results.py`: offline tests, including negative cases.
* `requirements-reporting.txt`: optional plotting dependency.
* `external_checkpoint_adapter.md`: inherited optional architecture contract. It is not an implemented adapter and is not required for the supplied tiny transformer.

## Environment setup

Use a fresh output directory for each experimental identity. Python and PyTorch must be installed before running the transformer pipeline.

For a CPU installation of the pinned PyTorch version, use the command selected for your operating system on PyTorch's official previous-versions page:

https://pytorch.org/get-started/previous-versions/

For the standard Linux and Windows CPU wheel index, that page documents this form:

```bash
python -m pip install torch==2.5.1 --index-url https://download.pytorch.org/whl/cpu
```

Runtime compatibility in the learner's particular environment remains UNKNOWN until the learner runs the checks. Do not infer compatibility from an unrelated environment label.

The arithmetic exercise and report summary use only Python's standard library. Plotting is optional:

```bash
python -m pip install -r requirements-reporting.txt
```

`requirements-reporting.txt` pins `matplotlib==3.10.6`. Matplotlib 3.10.6 was installed and used successfully to generate four PNG/SVG plot artifacts from provisional `torch2.14.0+cpu` artifacts; both PNG files were visually reviewed. This is separate from the pinned `torch2.5.1+cpu` full-run validation recorded below. The plotting result does not establish that the plots came from the pinned run.

The plotting implementation uses the documented `matplotlib.pyplot.subplots` API: https://matplotlib.org/stable/api/_as_gen/matplotlib.pyplot.subplots.html. It selects the noninteractive `Agg` backend before importing `pyplot`, following Matplotlib's backend documentation: https://matplotlib.org/stable/users/explain/figure/backends.html.

## Recorded validation

The pinned full run was completed and its artifacts were verified in Python 3.12.14 on Linux WSL2 using CPU-only `torch==2.5.1+cpu`. It completed 80 SFT steps and 40 DPO steps for each beta, generated 320 unique held-out comparisons, and used 240 training pairs with disjoint 40-pair in-distribution and 40-pair shifted-distribution holdout data. Artifact consistency checks passed, including finite metrics, reward arithmetic, an immutable reference, changed policy parameters, data split integrity, eight reconciled evaluation groups, blank human labels, and manifest hashes.

The recorded automated evaluation counts were 1 win, 3 losses, and 316 ties. These counts are an artifact result, not a quality claim. Human labels were blank for all 320 comparisons, so human agreement is UNKNOWN, with 0 of 320 comparisons labelled. No human-review conclusion is made.

The plotting validation used a separate provisional `torch2.14.0+cpu` input environment with Matplotlib 3.10.6. Do not treat that plotting environment as the pinned training environment, and do not infer cross-platform reproduction from either validation record. Learners must run the checks in their own environment.

## Standard-library worked case

Run:

```bash
python exercise.py fixtures/worked_case.json --key fixtures/worked_case.key.json
```

Expected output:

```text
{"chosen_ratio": 0.2, "chosen_reward": 0.02, "loss": 0.673347, "margin": 0.04, "rejected_ratio": -0.2, "rejected_reward": -0.02, "reward_accuracy": 1.0}
PASS: result matches key
```

The input has beta 0.1. Its chosen policy-to-reference log-ratio is:

```text
-1.2 - (-1.4) = 0.2
```

Its rejected ratio is:

```text
-2.0 - (-1.8) = -0.2
```

Multiplying by beta gives chosen reward 0.02 and rejected reward -0.02. The reward margin is `0.02 - (-0.02) = 0.04`. The loss is `log(1 + exp(-0.04))`, which rounds to 0.673347. Because the margin is positive, reward accuracy is 1.

## Independent changed-input task

Before opening `fixtures/changed_input.key.json`, calculate the result in `fixtures/changed_input.json`. Then run:

```bash
python exercise.py fixtures/changed_input.json --key fixtures/changed_input.key.json
```

Expected output:

```text
{"chosen_ratio": 0.1, "chosen_reward": 0.05, "loss": 0.620957, "margin": 0.15, "rejected_ratio": -0.2, "rejected_reward": -0.1, "reward_accuracy": 1.0}
PASS: result matches key
```

Decision trace: the chosen ratio is `-1.5 - (-1.6) = 0.1`; the rejected ratio is `-2.2 - (-2.0) = -0.2`; beta 0.5 scales these to 0.05 and -0.1. The margin is 0.15, so the rounded loss is 0.620957.

Run the offline tests with:

```bash
python -m unittest test_exercise.py test_report_results.py
```

The tests specify expected behavior. Their presence is not a claim that they were executed in every learner's environment. Negative tests cover nonpositive beta, duplicate comparison IDs, unknown IDs, invalid labels, and changed comparison metadata.

## Run the real transformer pipeline

The one-command path is:

```bash
python dpo_transformer_lab.py all --out artifacts/run1
```

The staged path makes each decision easier to inspect:

```bash
python dpo_transformer_lab.py data --out artifacts/run1
python dpo_transformer_lab.py checks --out artifacts/run1
python dpo_transformer_lab.py sft --out artifacts/run1
python dpo_transformer_lab.py dpo --out artifacts/run1
python dpo_transformer_lab.py eval --out artifacts/run1
```

Use `--resume` only when continuing a compatible stage:

```bash
python dpo_transformer_lab.py sft --out artifacts/run1 --resume
python dpo_transformer_lab.py dpo --out artifacts/run1 --resume
```

A resume must retain the run identity, data hashes, tokenizer, model shape, seed, batch size, learning rate, sampling rule, stage, and applicable beta and reference binding. A target below the saved step must be rejected. Extending SFT after DPO artifacts exist would change the reference underlying those policies, so use a fresh output directory instead. Load only trusted local PyTorch checkpoints because checkpoint deserialization can process Python objects. PyTorch serialization guidance is at https://pytorch.org/docs/stable/notes/serialization.html.

The model uses masked multi-head attention. The relevant PyTorch API, including causal-mask behavior, is documented at https://pytorch.org/docs/stable/generated/torch.nn.MultiheadAttention.html.

## Structural results versus measured results

The following are expected structural properties, not invented measurements:

* Training data contains 240 distinct synthetic addition preference pairs.
* SFT targets the chosen completions for 80 default steps.
* The frozen SFT model is the DPO reference.
* Separate policies train for 40 default DPO steps at beta 0.1 and beta 0.5.
* Evaluation includes held-out in-distribution addition prompts and shifted subtraction prompts at temperatures 0.2 and 0.8.
* Each comparison records both judge answer orders, and an order inconsistency is treated as a tie.
* The generated human-label CSV begins with blank labels. Blank labels are pending review, not negative judgments.

Actual losses, gradients, generations, win/tie/loss counts, lengths, runtimes, and agreement values are measured only from files produced by a learner's run. The recorded validation above is one verified run and is not a guarantee for another platform or environment.

## Summarize real outputs without plotting

After evaluation, run:

```bash
python report_results.py summary \
  --metrics 0.1=artifacts/run1/metrics_dpo_beta_0p1.csv \
  --metrics 0.5=artifacts/run1/metrics_dpo_beta_0p5.csv \
  --generations artifacts/run1/generations.jsonl \
  --human artifacts/run1/human_labels_pending.csv \
  --out artifacts/run1/report
```

Windows PowerShell one-line equivalent:

```powershell
python report_results.py summary --metrics 0.1=artifacts/run1/metrics_dpo_beta_0p1.csv --metrics 0.5=artifacts/run1/metrics_dpo_beta_0p5.csv --generations artifacts/run1/generations.jsonl --human artifacts/run1/human_labels_pending.csv --out artifacts/run1/report
```

This command does not import Matplotlib. It writes `artifacts/run1/report/report_summary.json` after strict validation.

Human rows are matched to generations by `comparison_id`. Duplicate IDs, IDs absent from generations, invalid labels, or changed beta, temperature, seed, distribution, prompt, policy output, or reference output are rejected. Empty human labels remain empty and are excluded from agreement. The summary preserves all raw human label fields.

The producer vocabulary is `policy`, `reference`, and `tie`. The reporter maps these labels to report verdicts as follows: `policy` becomes `win`, `reference` becomes `loss`, and `tie` remains `tie`. The generated records use this producer vocabulary, not producer `win` or `loss` labels. A swap-inconsistent producer judge record is retained, but its effective report verdict is `tie`.

The report gives `labelled_count`, `total`, coverage, agreement count, and agreement denominator. Agreement is computed only for rows whose `adjudicated_label` is nonblank. If the denominator is zero, agreement is JSON `null` with status `UNKNOWN`. Agreement on a reviewed sample is sample agreement only, not a population-level performance claim.

Each beta, temperature, and distribution group reports observed win, tie, and loss counts, swap consistency, average policy and reference lengths, and average winning and losing answer lengths for decisive comparisons. Missing averages are `null`, not fabricated zeros.

## Render training curves

After installing the optional dependency, run:

```bash
python report_results.py plot \
  --metrics 0.1=artifacts/run1/metrics_dpo_beta_0p1.csv \
  --metrics 0.5=artifacts/run1/metrics_dpo_beta_0p5.csv \
  --out artifacts/run1/report
```

Windows PowerShell one-line equivalent:

```powershell
python report_results.py plot --metrics 0.1=artifacts/run1/metrics_dpo_beta_0p1.csv --metrics 0.5=artifacts/run1/metrics_dpo_beta_0p5.csv --out artifacts/run1/report
```

For each beta this writes a standalone PNG and SVG containing chosen log-probability, rejected log-probability, and reward-margin curves. No display server is required. If Matplotlib is missing, the command stops with explicit installation guidance.

The supplied plotting validation produced four PNG/SVG artifacts with Matplotlib 3.10.6 from provisional `torch2.14.0+cpu` artifacts, and both PNG files were visually inspected. This does not mean that the pinned `torch2.5.1+cpu` run generated those plots. To plot a learner's pinned-run metrics, execute the plotting command against that learner's own output files.

Interpret the curves together. An increasing reward margin can result from chosen completions becoming more likely relative to the reference, rejected completions becoming less likely, or both. A larger training margin alone does not establish held-out quality. Compare the separate log-probability curves, held-out win/tie/loss groups, shifted-distribution results, swap consistency, and length diagnostics. Do not choose a beta from headline win rate alone.

## Synthetic reporting fixture

`fixtures/reporting_test.json` is a compact, fabricated test fixture for checking arithmetic and validation. It is explicitly not an observed run and does not contain learner labels. The unit test materializes its CSV and JSONL text into a temporary directory, calls the real reporting functions, and compares selected fields with `fixtures/reporting_test.key.json`.

## Human review procedure

1. Copy or open `artifacts/run1/human_labels_pending.csv` without changing comparison metadata.
2. Have reviewers inspect the policy and reference answers in each presented order.
3. Enter `policy`, `reference`, or `tie` in the two order-specific human fields.
4. Enter a nonblank `adjudicated_label` only after the review decision is complete.
5. Preserve reviewer IDs and notes according to the study's privacy policy.
6. Re-run the summary command. Do not edit `generations.jsonl` to make it match a changed label sheet.

A blank adjudicated label remains pending. It must never be counted as disagreement, agreement, loss, or tie. The reporter preserves the raw human fields and uses only nonblank `adjudicated_label` values for agreement.

## Safe cleanup of learner-generated outputs

Delete only a generated run directory that you selected for cleanup, for example:

```bash
rm -rf artifacts/run1
```

Windows PowerShell equivalent:

```powershell
Remove-Item -LiteralPath artifacts/run1 -Recurse -Force
```

Before deleting, confirm that the path is the intended generated run directory and not the source checkout. Do not delete source files, fixtures, tests, or checkpoints that you intend to retain. If a run contains checkpoints or review data you need, copy or archive those files first and choose a different generated directory for cleanup.

## Provider-neutral transfer

The optional transfer contract is architecture-neutral rather than a guarantee for named models. A learner-selected checkpoint needs a compatible architecture wrapper, its matching tokenizer, an explicitly versioned prompt or chat template, license permission for the intended use, and a hosting environment that supports its weights and inference requirements. The wrapper must expose completion-only log-probabilities and seeded autoregressive generation. It must also preserve reference freezing, beta validation, split integrity, metrics, swapped-order judging, and raw human-label handling.

Hugging Face Transformers and TRL are possible implementation libraries, documented in their official repositories at https://github.com/huggingface/transformers and https://github.com/huggingface/trl. No untested checkpoint, tokenizer, adapter, quantization method, license, or hosting configuration is claimed compatible.

The optional architecture adapter remains unimplemented. `external_checkpoint_adapter.md` documents a contract only; it does not provide a working adapter and is not required for this lab.

## Reflection

Which beta would you ship, and which evidence beyond headline win rate most affected the choice: swap consistency, shifted-distribution behavior, separate chosen and rejected likelihood movement, or answer-length diagnostics?

## Sources

* PyTorch previous-version installation instructions: https://pytorch.org/get-started/previous-versions/
* PyTorch serialization guidance: https://pytorch.org/docs/stable/notes/serialization.html
* PyTorch multi-head attention documentation: https://pytorch.org/docs/stable/generated/torch.nn.MultiheadAttention.html
* DPO paper: https://arxiv.org/abs/2305.18290
* TRL DPO trainer documentation: https://huggingface.co/docs/trl/en/dpo_trainer
* Matplotlib `subplots` documentation: https://matplotlib.org/stable/api/_as_gen/matplotlib.pyplot.subplots.html
* Matplotlib backend documentation: https://matplotlib.org/stable/users/explain/figure/backends.html
* Transformers official repository: https://github.com/huggingface/transformers
* TRL official repository: https://github.com/huggingface/trl

