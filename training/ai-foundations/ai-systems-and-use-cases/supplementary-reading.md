# Designing AI Systems, Not Just Models

When people say “AI,” they may mean different parts of a larger arrangement. Separating these parts helps you choose an appropriate use case and avoid giving a model responsibilities it cannot safely handle.

**Artificial intelligence** is the broad category: systems designed to perform tasks associated with human abilities, such as recognizing patterns, understanding language, making predictions, or generating content. Some AI uses hand-written rules. Other AI uses machine learning.

**Machine learning** is a way to create systems that learn patterns from examples. It is useful when rules are difficult to describe, but that is not the only reason to use it. Machine learning can also handle very large numbers of cases, adapt to changing patterns, or apply a consistent process repeatedly. For example, a message filter may learn from examples of unwanted messages and adapt as people change their tactics. Machine learning is not automatically the right choice: a simple, stable rule may be easier to understand, test, and maintain.

A **model** is a component that turns inputs into an output. It might suggest a category, identify details in a document, summarize text, or estimate a value. A model does not automatically know which organizational policy applies or who is authorized to act. It has no built-in understanding of accountability or consequences. Those abilities require surrounding data, instructions, access checks, workflow rules, monitoring, and people. Even if a model has built-in safety behavior, that behavior is only one control; it does not replace the organization’s complete process.

An **AI system** includes the model and the environment in which it is used. The system may include an intake form, selected data, instructions, identity and access controls, output checks, a review queue, records of decisions, escalation procedures, and the people responsible for the result. The system should also control what the model can see. For example, a request-triage system may need the request text and service category list, but not unrelated employee records or passwords accidentally pasted into a message.

Start with the work rather than the technology. Ask:

- What task needs support?
- What information is necessary, and what information should be excluded?
- What output would be useful?
- How could the output be checked?
- What happens if it is wrong?
- Who is affected and who is accountable?
- Can a person intervene before a consequential action?

Capabilities can be combined. A request workflow might extract a stated location, classify the request, summarize it, and draft a reply. These are separate capabilities with separate failure modes. Extraction should report what is explicitly present; it should not fill in missing facts. Classification should suggest a category; it should not silently authorize an action. Generation should produce a draft; it should not send a high-impact decision without approval.

The safest early use cases are not defined by one rigid checklist. Instead, prioritize these questions:

1. **Can the output be checked or corrected?** This is especially important when mistakes could cause harm.
2. **Can the system use only appropriate data?** Limit access and remove unnecessary sensitive information.
3. **Is the model’s role narrow and clear?** A suggestion is easier to govern than an unexplained final decision.
4. **Is a responsible person available to review, intervene, and handle exceptions?**
5. **Can the organization measure benefit and error?**

A task does not have to have a simple beginning and end. Continuous activities, such as monitoring or transcription, can be suitable when the inputs, outputs, escalation rules, and review responsibilities are clearly defined. Similarly, high-stakes uses are not automatically impossible. They require stronger evidence, qualified human oversight, appropriate controls, and a process that prevents the model from becoming the unreviewed decision-maker. If those conditions cannot be met, the task should be redesigned or kept human-led.

Good workflow design starts before the model runs. Decide which inputs are allowed, remove or mask unnecessary information, provide relevant instructions or reference material, and define what the model must not do. After the model runs, check the output, show supporting evidence where possible, record uncertainty, and route exceptions to a person. Controls before and after the model work together.

Human review should match the consequences of error. A draft heading may need a quick check. A recommendation affecting access, safety, health, employment, or finances may require an authorized reviewer and supporting evidence. An AI system may flag a possible safety concern, but that flag is a triage signal—not a final finding. A qualified person determines the appropriate response. If no meaningful intervention is possible, the task should not be automated.

Before adopting an AI-assisted process, write down its role in one sentence. For example:

> “The system extracts stated details, suggests a category and urgency flag, and prepares a handoff; an authorized coordinator verifies the evidence and decides the next action.”

This sentence makes the boundary visible: the system assists with information handling, while people remain responsible for consequential decisions.

---