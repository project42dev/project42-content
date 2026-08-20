# Context, Tokens, and Modalities

Package: `context-tokens-and-modalities-class` 1.0.0

> This is the canonical text equivalent of an AI-assisted virtual-instructor
> class. It remains usable without synthesized audio, video, animation, or a
> player runtime.

## Welcome: Welcome And Outcomes

Welcome. In this class, you will build a practical model of tokens, context windows, and multimodal input. The goal is not to memorize a provider limit. Limits and product behavior change. The goal is to decide what information belongs in a request, how to label its authority, what can be lost or misread, and what must live in a durable system outside the conversation. We will examine token units, treat context as a bounded working set, practice selecting and structuring evidence, and apply quality and accessibility checks to text, images, audio, and files.

## Narration: Token Units Explanation

Models process represented units called tokens rather than human page counts. A token may be a short word, part of a longer word, punctuation, whitespace, a code fragment, or another symbol. The exact boundary depends on the tokenizer used by the model and product. That is why a thousand words do not always become the same number of tokens, and why code, tables, languages, or unusual formatting may consume a different amount of capacity. Tokens matter in several places. Products limit how much input and output a request can contain, measure usage, and may calculate cost from token counts. Generated tokens also occupy space while a response is produced. Do not estimate a high-stakes limit by dividing characters or words with a universal formula. Use the current provider's tokenizer or counting method for the exact model and interface, then leave capacity for instructions, tool results, and the response. The practical rule is simple: token counts are implementation measurements, not document meaning.

Sources:

- <https://developers.openai.com/api/docs/concepts>

## Demonstration: Token Budget Demonstration

Imagine a request that includes instructions, a policy, five meeting transcripts, a spreadsheet export, and a long requested answer. A weak plan counts only the visible policy words and assumes everything fits. A stronger plan inventories every component: trusted instructions, conversation history the product includes, document text after parsing, tool definitions, retrieved passages, and expected output. It uses the current counting tool, records the model and interface, and reserves headroom instead of filling the maximum. If the package is too large, the safe response is not to remove citations or compress away critical exceptions. First remove duplicates and unrelated material. Then split the task, retrieve only the sections needed, or move stable facts into a controlled external record. Capacity planning should preserve authority and meaning, not merely reach a smaller number.

Sources:

- <https://developers.openai.com/api/docs/concepts>
- <https://platform.claude.com/docs/en/build-with-claude/context-windows>

## Narration: Context Working Set Explanation

The context window is the bounded working information available while a response is generated. Depending on the product, it may include system instructions, developer or user messages, conversation history, supplied documents, images, tool definitions, tool results, and generated tokens. It is not the same as everything learned during training, and it is not a permanent database. Products may truncate, summarize, compact, retrieve, or omit material as a conversation grows. A larger window can hold more, but capacity does not guarantee correct attention to every detail. Conflicting instructions can still conflict. An important clause can still be buried. Untrusted text can still attempt to redirect a tool-using system. Duplicate documents can still create ambiguity. Treat context as a designed working set: make authority explicit, organize related evidence, put constraints where the workflow preserves them, and test whether the result actually uses the necessary facts. More context is useful only when it improves the evidence and decisions available to the task.

Sources:

- <https://developers.openai.com/api/docs/concepts>
- <https://platform.claude.com/docs/en/build-with-claude/context-windows>

## Checkpoint: Larger Context Checkpoint

Checkpoint. In one sentence, explain why a larger context window does not guarantee that every supplied detail will be used correctly. Include one design practice that improves the working set.

Expected learner action: Explain that capacity is not guaranteed attention or correctness, then name a practice such as authority labels, structure, deduplication, retrieval, or testing.

Sources:

- <https://platform.claude.com/docs/en/build-with-claude/context-windows>

## Pause: Larger Context Response Time

## Feedback: Larger Context Feedback

A strong answer separates capacity from correct use. A large window may hold the material while the system still misses a buried exception, follows conflicting authority, overweights duplicates, or mishandles untrusted content. Better design selects relevant evidence, labels its source and authority, structures the request, retrieves bounded passages when needed, and evaluates whether critical facts survive. If your answer said that a larger window creates permanent memory, revise it. Context is a temporary working set whose contents and lifecycle depend on the product. Durable facts and accountable records need controlled storage outside the conversation.

Correct feedback: You separated capacity from correct use and named a concrete context-design practice.

Retry feedback: Revise the sentence so context remains a bounded working set and structure or evidence selection improves how it is used.

Sources:

- <https://platform.claude.com/docs/en/build-with-claude/context-windows>

## Narration: Selection And Structure Explanation

Build context by role and trust. Start with the objective and success criteria. Separate authoritative instructions from reference material. Label the source, version, date, and trust boundary of evidence. Remove duplicates and unrelated history. Mark external text, retrieved pages, emails, and user-supplied files as content to analyze rather than instructions to obey. Ask for a defined output and state how important claims will be verified. When the corpus is larger than the working set, retrieve bounded passages with source metadata rather than dumping the entire repository. When a fact must persist—an approval, customer record, policy version, audit event, or workflow state—store it in a controlled system of record. The model can read an authorized view when needed, but the conversation is not the record. This separation also improves recovery. A new session can reconstruct its working context from approved sources instead of depending on an opaque chain of old messages.

Sources:

- <https://platform.claude.com/docs/en/build-with-claude/context-windows>
- <https://ai.google.dev/responsible/docs>

## Learner Prompt: Trust Label Prompt

Choose a task with at least three possible inputs. Label one input authoritative evidence, one supporting context, and one untrusted or unnecessary item. For each label, write a one-sentence reason. Then identify one fact or record that must persist outside the conversation.

Expected learner action: Classify three inputs by role and trust with reasons, and name one durable fact or record that belongs outside model context.

Sources:

- <https://platform.claude.com/docs/en/build-with-claude/context-windows>

## Pause: Trust Label Work Time

## Narration: Modality Checks Explanation

Every input modality adds a different observation and a different failure surface. Text can contain conflicting authority or hidden instructions. An image may be cropped, low contrast, rotated, or missing the region that matters. Audio may be noisy, overlap speakers, or omit context conveyed by a visual. Video adds timing and scene boundaries. A document parser may flatten headings, omit tables, reorder columns, or ignore scanned pages. File metadata may expose sensitive information that the visible content does not show. Confirm what the system actually received before trusting the interpretation. Preserve the original artifact, record any transformation, and verify important claims against that original. Provide accessible text alternatives and transcripts so the task is not available only to people who can see or hear one modality. A model-generated description is an interpretation, not a replacement for the artifact or for qualified human review when consequences are high.

Sources:

- <https://developers.openai.com/api/docs/concepts>
- <https://ai.google.dev/responsible/docs>

## Demonstration: Multimodal Verification Demonstration

Suppose a learner uploads a photograph of a printed safety procedure and asks for a checklist. Before generating, inspect the input path. Is the full page visible? Is the revision date readable? Did glare hide a warning? Is there a second page? Does the product preserve orientation and resolution? First create or request an accessible text transcription, compare it with the image, and mark any uncertain passage. Then generate the checklist from the verified transcription while retaining the procedure's version and source. Finally, compare every safety-critical checklist item with the original image or authoritative document. The model may help transform the format, but it should not silently invent obscured words. If the artifact is incomplete, the correct result is a visible limitation and a request for better evidence, not a confident reconstruction.

Sources:

- <https://ai.google.dev/responsible/docs>

## Transition: Activity Transition

Now build your trustworthy context budget. Inventory at least three possible inputs and label each as instruction, authoritative evidence, supporting context, untrusted content, or unnecessary material. Create a compact package containing the objective, boundaries, selected evidence, source labels, output contract, and verification method. Then list the facts, approvals, or workflow state that must persist in an external record or retrieval system. Finish by explaining one item you removed and why the removal made the task safer or clearer.

Sources:

- <https://developers.openai.com/api/docs/concepts>
- <https://platform.claude.com/docs/en/build-with-claude/context-windows>
- <https://ai.google.dev/responsible/docs>

## Pause: Activity Work Time

## Assessment Handoff: Assessment Handoff

When you are ready, begin the knowledge check. You will define tokens, identify the context working set, choose bounded and labeled evidence, preserve durable facts outside the conversation, and apply original-artifact and accessibility checks to multimodal input. You may review the transcript, static alternatives, or activity before starting. No assessment opens or submits until you choose Begin knowledge check.

## Closing: Class Closing

Remember: context is a bounded working set, not permanent memory. Select trustworthy evidence, label authority, preserve durable records outside the conversation, and verify every modality against the original artifact.
