# Lab: Can a Fluent Answer Be Trusted?

## Objective

Use a language model to investigate how prompts, context, and available generation settings affect an answer. Then separate:

- What the model can produce
- What it does not produce or declines to produce
- How confident the response sounds
- Which claims can be verified

## Prerequisites

- Access to a chat interface that accepts text prompts
- The ability to copy and compare responses
- A note-taking document or paper
- No private, confidential, or sensitive information

If you cannot access a chat interface, complete the comparison by predicting the likely results and marking generation steps as unavailable. Do not paste sensitive information into any service.

## Scenario

You are helping a team understand this fictional travel policy:

> Employees may claim one standard meal on each full day of an approved business trip. On travel days, employees may claim one meal only when the trip includes at least six hours away from their normal work location. Receipts are required for meals costing more than 25 units of local currency. Claims must be submitted within 30 days after the trip ends. The policy does not cover alcoholic drinks.

The text above is the only policy source for this lab.

## Instructions

### 1. Generate a baseline answer

Open the chat interface and submit:

> What does this travel policy say about meals, receipts, deadlines, and alcoholic drinks?

Record the complete response.

**If this step fails:** Check that the message was submitted and that the response has finished. If the interface is unavailable, write “baseline unavailable” and continue with the prediction and comparison steps.

### 2. Test the effect of output instructions and context

Start a new conversation, if possible, and submit:

> Using only the policy text below, provide exactly four bullet points. Cover meals, receipts, deadlines, and alcoholic drinks. Do not add rules that are not stated.  
>  
> [Paste the fictional travel policy here.]

Record the response and compare it with the baseline.

**If this step fails:** Confirm that the policy text was included and that the instruction asks for exactly four bullets. If the system limits message length, remove extra blank lines but keep the complete policy.

### 3. Test the effect of missing context

Submit this prompt without including the policy:

> What is the meal limit on a travel day, and when are receipts required?

Record the response. Do not treat an answer as correct merely because it sounds specific.

**If this step fails:** If the interface refuses the prompt, add a short instruction such as “If the information is missing, say that you cannot determine it.” Record that the original attempt failed.

### 4. Test the effect of added context

Submit:

> Answer only from the policy below. If the policy does not answer a question, say “Not stated.”  
>  
> Question: What is the meal limit on a travel day, and when are receipts required?  
>  
> Policy: [Paste the fictional travel policy here.]

Record the response. Check whether it distinguishes a full day from a travel day and includes the six-hour condition.

**If this step fails:** Make sure the policy is pasted after the question and that the six-hour sentence is included. If the response still adds unsupported rules, mark those additions as unverified rather than editing them silently.

### 5. Compare an available generation setting

If the interface provides a clearly labeled control that changes response variation or predictability, submit the same prompt twice: once with the current setting and once with a noticeably different available setting. Record the setting label and value or description exactly as shown.

Use this prompt:

> List every rule in the policy as a numbered list. Use only the policy text.

If a control is visible but unlabeled or its purpose is unclear, do not guess what it means. Record “Unlabeled or unclear control; not interpreted,” leave it unchanged, and compare two repeated responses instead. If no relevant control is available, write “No user-visible setting available” and compare two repeated responses.

**If this step fails:** If the setting cannot be changed, use two separate conversations with the same prompt. If the responses are identical, that is still an observation to record. If changing the setting causes an error, return to the original setting, record the error without guessing its cause, and use repeated responses instead.

### 6. Evaluate capability, confidence, and correctness

Create a table with these columns:

| Claim or requested point | Did the model produce it? | If not, what happened? | How confident did it sound? | Is it supported by the policy? |
|---|---|---|---|---|

Add at least five claims or requested points from the responses. Include any claim that appears plausible but is not stated in the policy. Also include at least one requested point that the model failed to answer, refused to answer, or answered only by saying it lacked information, if such a case occurred. If every response answered every point, add a row such as “A second meal is allowed on a travel day” and mark “No” under “Did the model produce it?” Do not present that invented row as something the model said.

For example, “Claims must be submitted within 30 days” is supported. “Employees may claim two meals on a travel day” is not supported.

**If this step fails:** Copy individual sentences from the responses instead of evaluating the whole answer at once. For a missing answer, record the requested point and describe the absence in the “If not, what happened?” column. Compare each produced sentence directly with the policy.

### 7. Write your conclusion

Answer these questions in five to eight sentences:

1. How did adding context change the response?
2. Did the model answer more confidently when the policy was missing?
3. Did changing the available setting change wording, structure, or facts?
4. Which response was easiest to verify, and why?
5. Did the model fail to produce or decline any requested point?
6. What verification step would you add before using this process for a real policy?

**If this step fails:** Use the recorded responses and complete one question at a time. A short, evidence-based conclusion is sufficient.

## Expected output

Your completed lab should contain:

- At least three recorded model responses or clearly marked unavailable attempts
- A comparison of prompts with and without policy context
- A comparison involving an available setting, or a note that none was available
- A claim-evaluation table with at least five claims or requested points
- At least one observation about a claim produced, unsupported, omitted, or refused
- A five- to eight-sentence conclusion

The strongest result is not necessarily the longest response. It is the response that stays within the supplied policy and makes its claims easy to verify.

## Troubleshooting

- **The model adds a rule not found in the policy:** Mark the claim unsupported, then repeat the prompt with “Use only the policy text” and “Not stated” instructions.
- **The model refuses or gives no response:** Remove nonessential formatting, start a new conversation, and retry. Record the failure if it continues; an omission is still an observation about the model’s behavior.
- **The model changes its answer between attempts:** Compare the wording and check both versions against the policy. Variation is an observation, not evidence that either answer is correct.
- **The response is too long to evaluate:** Ask for a numbered list of claims, or evaluate the first five claims only.
- **A setting is visible but unlabeled or unclear:** Do not infer its meaning. Record that it was not interpreted and use two repeated responses instead.
- **The interface does not show settings:** Record that no user-visible setting was available. Do not infer hidden settings.
- **You accidentally include sensitive information:** Stop, remove the information if possible, and restart with only the fictional policy.

---