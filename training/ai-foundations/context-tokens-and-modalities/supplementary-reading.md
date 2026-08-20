# Context Is a Design Choice

When people first use an AI assistant, they often assume that more information will always produce a better answer. In practice, extra material can make the important details harder to find. Unrelated documents may distract from the task, while repeated or contradictory instructions may make the response less focused.

Think of context as a working desk. You could place every document in your office on the desk, but finding the right paragraph would become difficult. A better approach is to put only the materials needed for the task within reach and keep a clear record of where those materials came from.

## Tokens are approximate units of reading and writing

Tokens are pieces of text that a model processes. They are not exactly the same as words. A short word may be one token, while a long or unusual word may be split into several pieces. Punctuation, numbers, spaces, and formatting can also affect tokenization. For example, a familiar word might be handled as one piece, while an uncommon word could be divided into smaller pieces.

You usually do not need to count tokens by hand. The practical lesson is that text takes up space, and some text takes more space than it appears to. A long report, a table, repeated instructions, and a conversation history can consume available context quickly.

A context limit is not necessarily handled the same way by every AI system. When the supplied material is too large, a system might truncate some content, prioritize selected content, summarize earlier messages, or refuse the request. In any of these cases, the model may not have the original wording of every source available when it produces its answer. Do not assume that a confident answer means the entire conversation or every document was considered. Keep important source passages or decisions in a separate record so they can be checked again.

## Relevance is more useful than volume

Before adding material to a prompt, ask:

1. **Is this information needed for the task?**
2. **Is it authoritative for this question?**
3. **Does it add something that is not already present?**

For example, a request to compare two policies may need the policy text, the comparison criteria, and the date of each policy. It probably does not need an unrelated team biography or the full history of the organization.

A small context plan can help:

- **Task:** What should the assistant produce?
- **Evidence:** Which facts or passages support the answer?
- **Boundaries:** What should the assistant not use or assume?
- **Output rules:** What format, audience, and length are required?

This plan separates useful evidence from information that merely happens to be available. It also makes later checking easier: if a claim does not fit the task or an allowed source, it should be questioned.

## Different media have different failure modes

Text can be incomplete, ambiguous, or badly formatted. Images introduce additional concerns. An image may be blurry, cropped, low contrast, rotated, or difficult to interpret because of a complex background. A diagram may contain tiny labels that are technically present but practically unreadable. A photograph may show an object without providing enough context to identify its meaning.

Audio and video have their own challenges, including background noise, accents, overlapping speakers, missing captions, and unclear timestamps. Accessibility is therefore part of input quality, not an optional extra. If a visual contains essential information, provide a text description or transcription as well. If a recording matters, provide captions, a transcript, or a concise account of the relevant segment.

A multimodal review can include four questions:

- Can the model receive the medium?
- Is the important content clear and complete?
- Is there an equivalent accessible representation?
- Is the interpretation reliable enough for the consequences of the decision?

For high-impact decisions, treat model interpretation as a starting point for review rather than as a final measurement.

## Plan for conversations that outlive the context

A conversation can feel continuous to a person even when the model no longer has every earlier detail in its active context. Important information should not exist only in a long chat. Create an external record for decisions, definitions, assumptions, source links, unresolved questions, and approved outputs.

At useful points, ask for a compact handoff summary. Check it against the original sources before beginning a new conversation. A good handoff identifies what is known, what is uncertain, what constraints still apply, and what should happen next. This is more reliable than repeatedly asking the model to “remember everything.”

Source boundaries deserve explicit attention. Tell the assistant which sources are allowed, which are background only, and which must not be used. If sources disagree, ask the assistant to show the disagreement instead of silently combining the claims. Preserving the boundary between evidence and inference makes the final answer easier to inspect.

The goal is not to provide the largest possible context. The goal is to provide a deliberate, understandable, and accessible context that gives the model the right material for the job.

---