# What AI Does—and Does Not Do

Package: `what-ai-does-class` 1.0.0

> This is the canonical text equivalent of an AI-assisted virtual-instructor
> class. It remains usable without synthesized audio, video, animation, or a
> player runtime.

## Welcome: Welcome And Outcomes

Welcome. This class builds the mental model that every later Project 42 lesson depends on. You will separate the model from the product around it, identify what retrieval, memory, tools, and agentic loops add, match useful capabilities to bounded tasks, recognize why fluent output can fail, and scale verification to risk. The goal is neither hype nor fear. It is knowing what evidence you need before a generated result deserves trust.

## Narration: Model Product Workflow Explanation

Start by separating components. A model is learned software that maps inputs to outputs. A language model generates likely token sequences from its learned parameters and the context supplied for this request. An AI-enabled product can add a user interface, instructions, files, retrieval, web search, memory, safety policy, identity, and deterministic business rules. A tool can read or change another system. An agentic workflow adds state, feedback, and some model-directed control over which action happens next. These boundaries matter. If a chat product finds today's policy, a retrieval or search component obtained it; the model did not prove that the page was part of training or that every summary claim is correct. If an assistant edits a file, a tool performed the write under surrounding permissions. Describe the observed behavior instead of assigning every product capability to the model.

Sources:

- <https://developers.google.com/machine-learning/crash-course/llm/transformers>
- <https://developers.openai.com/api/docs/models>

## Demonstration: Web Summary Demonstration

Suppose an assistant opens a current vendor page and produces a summary. The model contributes language understanding and generation. The product resolves the location, retrieves the page, packages content into context, and may provide citations. Network access and permissions come from the tool boundary. The page is evidence only after we confirm its publisher, date, version, scope, and actual passage. The summary remains a generated interpretation. If the assistant also saves the note, a file tool creates that side effect. If it chooses another source after a failed check and repeats, the workflow has agentic behavior. One interaction can therefore combine several components. A useful explanation says which component did what and which evidence supports the final claim.

Sources:

- <https://www.nist.gov/itl/ai-risk-management-framework>

## Narration: Capabilities Explanation

Use AI where pattern recognition and generation can support a bounded outcome. Common tasks include explanation, summarization, rewriting, translation, classification, extraction, comparison, brainstorming, drafting, code assistance, analysis of supplied data, and work across supported text, image, audio, or video inputs. Capability is not uniform. Results depend on the exact model and version, modality, language, task, prompt, context, tools, and evaluation. A stronger model does not make missing evidence appear. A larger context does not guarantee that every detail is used correctly. Multimodal input does not prove accurate interpretation of every image or sound. Begin with a concrete deliverable, permitted relevant context, constraints, an output contract, and acceptance checks. Test the exact available system on representative examples instead of generalizing from a demo or provider label.

Sources:

- <https://developers.openai.com/api/docs/models>
- <https://developers.google.com/machine-learning/crash-course/llm/transformers>

## Learner Prompt: Component Boundary Prompt

Choose one AI product behavior you have seen. Identify what came from the model, supplied context, retrieval or search, memory, a tool, deterministic code, or an agentic loop. Mark anything you cannot verify as unknown.

Expected learner action: Create an evidence-aware component map without assigning unknown product behavior to the model.

Sources:

- <https://www.nist.gov/itl/ai-risk-management-framework>

## Pause: Component Boundary Work Time

## Narration: Limitations Explanation

Fluent language, confident tone, detailed structure, and citation-shaped text are not evidence. A model can fabricate a source, merge separate facts, use stale knowledge, omit a limitation, inherit bias, misunderstand context, produce incompatible numbers, or vary across runs. It does not automatically know private systems, today's events, local policy, or the user's unstated goal. Context is finite and may contain conflicts or malicious instructions. Retrieval can return the wrong page. Tools can fail or report uncertain outcomes. Code can compile incorrectly or look correct without running. A generated explanation of success is not the same as a verified postcondition. Treat output as a candidate. Ask which claims matter, what evidence would support them, whether the evidence matches version and scope, and what remains unknown. Uncertainty that is visible can be managed; unsupported confidence cannot.

Sources:

- <https://www.nist.gov/itl/ai-risk-management-framework>
- <https://developers.google.com/machine-learning/crash-course/llm/transformers>

## Checkpoint: Current Policy Checkpoint

Checkpoint. A model confidently states the current employee leave policy and provides no source. The answer sounds professional and matches what a manager remembers from last year. Can the employee rely on it, and what evidence is required?

Expected learner action: Do not rely on the generated claim; verify the current authoritative policy and scope, then use qualified human review when consequences require it.

Sources:

- <https://www.nist.gov/itl/ai-risk-management-framework>

## Pause: Policy Check Response Time

## Feedback: Current Policy Feedback

Do not rely on the answer. Professional wording and a manager's memory do not establish the current policy. Open the authoritative policy source, confirm its effective date, covered employee group, location, exceptions, and approval owner. If the current source is unavailable or ambiguous, report the gap and contact the responsible human function. If you accepted the answer because two uncertain signals agreed, revise the rule: generated confidence plus memory is not independent current evidence. If you rejected all AI assistance, narrow that conclusion. AI may help explain the verified policy, but it cannot replace the source or accountable decision.

Correct feedback: You separated useful explanation from current policy authority and required source, scope, and accountable review.

Retry feedback: Ask whether confidence and memory establish the current effective policy for this employee group. They do not.

Sources:

- <https://www.nist.gov/itl/ai-risk-management-framework>

## Narration: Task Selection Explanation

Choose tasks by consequence and inspectability. Brainstorming, first drafts, restructuring permitted text, orientation, and low-risk classification can tolerate some uncertainty when the result is reviewed. Prefer reversible work with clear acceptance criteria. Raise the bar for medical, legal, financial, employment, access, security, safety, production, and other consequential decisions. These need current qualified evidence, accountable human oversight, authorization, audit, and recovery. Do not delegate responsibility because a product can produce an answer or perform an action. If the task is deterministic, a fixed workflow may be simpler and safer. If required evidence is missing, narrow the task to finding or organizing information, report the gap, or stop. The right question is not, can AI attempt this? It is, can this specific workflow produce a verified result inside its authority and risk boundary?

Sources:

- <https://www.nist.gov/itl/ai-risk-management-framework>

## Narration: Risk Scaled Verification Explanation

Scale verification using four questions. What harm could an error cause? How quickly can the facts or system change? How uncertain are the evidence and model performance? How reversible is the output or action? For low-consequence ideation, human inspection and clear labeling may be enough. For current factual work, open authoritative sources and map claims to passages. For calculations, independently reconcile inputs, units, and totals. For code, run type, test, build, and behavior checks. For tool actions, verify the real target-system postcondition and absence of duplicate or forbidden effects. Add independent reviewers and exact approval as consequence rises. Record pass, fail, unknown, or not applicable. Stop when identity, source, target, permission, or outcome remains too uncertain for the next action.

Sources:

- <https://www.nist.gov/itl/ai-risk-management-framework>

## Demonstration: Verification Demonstration

Consider an AI-generated meeting agenda and an AI-generated command that deletes cloud resources. The agenda is reversible and easy to inspect. Confirm names, time, purpose, and accessibility, then edit it. The deletion is consequential and difficult to reverse. A plausible command is not enough. Resolve the exact account and resources, confirm authorization, preview impact, verify backups and recovery, require exact current approval, execute through a controlled tool, and inspect postconditions. If any target or recovery fact is uncertain, stop. The same model capability can support both tasks, but the verification and authority requirements are radically different.

Sources:

- <https://www.nist.gov/itl/ai-risk-management-framework>

## Transition: Activity Transition

Open the AI capability boundary activity. Choose one AI-enabled task. Map the model, product, context, retrieval, memory, tools, deterministic code, and agentic behavior, marking unknowns. Define the bounded outcome, permitted context, output contract, and excluded behavior. List three plausible failures. Rate consequence, volatility, uncertainty, and reversibility. Build the evidence and human-review plan, then record a final decision to use AI, use a deterministic workflow, narrow or redesign the task, or stop.

Sources:

- <https://www.nist.gov/itl/ai-risk-management-framework>

## Pause: Activity Work Time

## Assessment Handoff: Assessment Handoff

When you are ready, begin the knowledge check. You will identify a language model, separate retrieval from generation, explain why confidence is not evidence, scale verification to risk, and stop when evidence or authority is missing. Review the class or return to the activity before submitting. The assessment begins only when you choose Begin knowledge check.

## Closing: Class Closing

Keep the boundary clear: models generate, products add context and capability, evidence earns trust, and people remain responsible for consequential decisions.
