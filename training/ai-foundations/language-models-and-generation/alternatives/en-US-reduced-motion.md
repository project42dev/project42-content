# How Language Models Produce Responses: reduced-motion presentation

Present every visual as a complete static composition. Do not make completion
depend on animation timing, autoplay, or pointer gestures.

## training-and-inference-explanation

Display the complete comparison at once and use a persistent outline to indicate the row being discussed.

Text alternative: Training changes model parameters using examples. Inference uses those trained parameters with the current request and context. Retrieval and tools sit outside the base model.

## training-inference-demonstration

Show both scenarios simultaneously; emphasize the selected boundary with color and text, not animation.

Text alternative: Scenario one has only model and prompt, so no current weather source is shown. Scenario two adds a timestamped weather-service result outside the model.

## generation-step-explanation

Present the initial sentence, candidates, selection, and resulting sentence as four numbered static rows.

Text alternative: The model considers possible next pieces for an unfinished sentence, selects one, adds it to context, and repeats. The example is illustrative rather than a real probability display.

## system-design-explanation

Show every layer at once as a numbered list with arrows represented by text labels.

Text alternative: The response comes from a system: trusted instructions and context feed a model; retrieval and tools can add evidence or actions; validation and human decisions govern the result.

## certainty-explanation

Display all three cards simultaneously with persistent headings and no animated transitions.

Text alternative: Capability describes what a system can do. Confident expression is a language style. Verified correctness requires external evidence or testing appropriate to the risk.
