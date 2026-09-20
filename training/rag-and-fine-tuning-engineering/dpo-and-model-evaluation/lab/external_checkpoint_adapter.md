# Optional external-checkpoint adapter contract

This path is outside the download-free core and has not been validated for Qwen, Llama, DeepSeek, Mistral, Phi, or another external architecture.

Implement a wrapper with these operations:

```python
class ExternalCausalLMAdapter:
    def completion_logps(self, prompts, completions):
        """Return one differentiable summed completion-token log-probability per pair."""

    def generate(self, prompt, temperature, seed, max_new_tokens):
        """Return one decoded completion while recording all decoding controls."""

    def freeze(self):
        """Disable gradients and mutation for every reference parameter."""

    def parameter_hash(self):
        """Return a stable digest used before and after DPO."""
```

The completion mask must exclude every prompt token and include completion tokens consistently, including a documented EOS policy. Use the checkpoint's own tokenizer and versioned chat template. Verify padding side, BOS/EOS insertion, truncation, tied weights, quantization behavior, and adapter-only versus full-parameter optimization.

Feed the adapter the generated `prompt`, `chosen`, and `rejected` records. Preserve the two independent policy copies, betas 0.1 and 0.5, frozen reference, finite-gradient checks, metrics fields, held-out distributions, two temperatures, recorded seeds, swapped answer orders, raw human CSV, hashes, and manifest.

Official implementation references:

* Transformers repository: https://github.com/huggingface/transformers
* TRL repository: https://github.com/huggingface/trl
* TRL DPO documentation: https://huggingface.co/docs/trl/en/dpo_trainer

Compatibility and resource requirements are UNKNOWN until the learner selects a specific checkpoint revision, tokenizer revision, precision, and adapter implementation and runs model-specific tests.
