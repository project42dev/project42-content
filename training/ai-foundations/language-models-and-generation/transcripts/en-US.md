# How Language Models Produce Responses

Package: `language-models-and-generation-class` 1.0.0

> This is the canonical text equivalent of an AI-assisted virtual-instructor
> class. It remains usable without synthesized audio, video, animation, or a
> player runtime.

## Welcome: Welcome And Outcomes

Welcome to How Language Models Produce Responses. This beginner class builds a practical mental model of training, inference, tokens, context, generation, and verification. You will also practice checking factual claims against supplied evidence and correcting fluent but unsupported wording. The examples are fictional, and the core activity needs no AI account, software, internet access, or outside facts. Keep one guiding question in mind: what does the evidence actually establish?

## Narration: Training And Inference Explanation

A model is a mathematical structure with parameters that processes inputs and produces outputs. A large language model is a language model with many parameters and is typically based on the Transformer architecture. Training determines or adjusts parameters, including weights and biases, by using examples. Inference happens afterward, when the trained model receives a prompt and generates a response. Typing a prompt normally begins inference, not another training run. This distinction prevents a common mistake: the response alone does not prove that a reliable record was searched. A surrounding application may provide retrieval or tools, but you must establish that they are available and check their results. If a needed fact is absent from the prompt and unavailable through a verified source or tool, more confident wording cannot supply it.

Sources:

- <https://developers.google.com/machine-learning/glossary#model>
- <https://developers.google.com/machine-learning/glossary#large-language-model>
- <https://developers.google.com/machine-learning/glossary#training>
- <https://developers.google.com/machine-learning/glossary#inference>

## Narration: Tokens Context Generation Explanation

A token is an atomic unit on which a language model is trained and makes predictions. Depending on the model, a token may be a word, a character, or a subword. One tokenizer might represent dogs as one token, while another might use dog and s. Therefore, splitting text at spaces does not reproduce every model's tokenization. A prompt is text supplied to condition behavior. It can include instructions, questions, examples, roles, facts, or partial text. A context window is the number of tokens a model can process in a prompt. More context can make more information available, but it does not prove that the information is true. During generation, the model estimates possible next tokens from the current context. A decoding process selects one, adds it to the context, and repeats. This can create coherent prose without retrieving an exact stored paragraph. A likely continuation can still be unsupported because likelihood concerns continuation, while factual support concerns evidence.

Sources:

- <https://developers.google.com/machine-learning/glossary#token>
- <https://developers.google.com/machine-learning/glossary#prompt>
- <https://developers.google.com/machine-learning/glossary#context-window>

## Checkpoint: Plausibility Checkpoint

Checkpoint. Imagine the unfinished sentence says, The event fee is, and a fictional teaching distribution makes free the likelier continuation. What must you know before publishing that the event is free? Answer in one sentence and separate token likelihood from factual evidence.

Expected learner action: State that a likely continuation does not establish the fee and that supplied or authoritative evidence is needed.

Sources:

- <https://developers.google.com/machine-learning/glossary#temperature>

## Feedback: Plausibility Feedback

A strong answer says that likely wording is not enough. You need a supplied fee fact or another appropriate authoritative source establishing the fee. The lesson's probability numbers are invented for teaching, not measurements from a real model. Changing randomness may affect selection, but it cannot guarantee truth. If you treated fluent continuation as evidence, revise your answer so generation and verification remain separate jobs.

Correct feedback: You separated likely continuation from evidence that establishes the fee.

Retry feedback: Revise your answer to name the evidence needed and keep token likelihood separate from factual support.

Sources:

- <https://developers.google.com/machine-learning/glossary#temperature>

## Narration: Toy Generation Narration

The Python example is a hand-written, deterministic word-level lookup. It is not a trained language model, does not calculate probabilities, and does not use a real tokenizer. Starting with A, the first dictionary follows small, map, can, sound, certain, while, being, and wrong. The resulting sentence is: A small map can sound certain while being wrong. Starting with Event, the second dictionary follows fee, is, and free. It prints Event fee is free. because that fixed mapping was written into the code. The output does not establish any fee fact. The evidence-based correction is: Event fee is not provided. The displayed trace should read Event to fee, fee to is, and is to free. No execution is claimed. The expected output follows directly from the fixed dictionaries and print statements. Real language models instead use learned parameters, model-specific tokens, and decoding.

Sources:

- <https://developers.google.com/machine-learning/glossary#token>
- <https://developers.google.com/machine-learning/glossary#inference>

## Demonstration: Toy Generation Demonstration

Now walk through the two fixed sequences. For Toy one, read the output exactly: A small map can sound certain while being wrong. Then follow each arrow in order and notice that every current word has one hand-written successor. For Toy two, read Event fee is free. Next compare that sentence with the supplied evidence, which states no fee. Replace the unsupported claim with Event fee is not provided. The teaching point is not that real models use this code. The point is that repeated selection can yield grammatical output while evidence review can still require correction.

Sources:

- <https://developers.google.com/machine-learning/glossary#token>

## Narration: Inputs Shape Output Explanation

Instructions specify the task, audience, format, and boundaries. Context can supply facts, examples, prior messages, files, or tool results. Policies, model choice, retrieval, tools, decoding, and validation can also shape output. These influences are not proof of correctness. When a response is weak, diagnose what is missing. An unclear task may need clearer instructions. An unsupported claim may need authoritative evidence. A calculation may need a suitable tool and a checked result. A high-impact decision may need qualified human review. For factual review, split the response into individual claims. Label each claim supported, contradicted, or not established. Supported means the supplied evidence establishes it. Contradicted means an explicit supplied fact conflicts with it. Not established means the evidence does not settle it. Remove or disclose missing details, and replace contradicted details with the supplied facts.

Sources:

- <https://developers.google.com/machine-learning/glossary#prompt>
- <https://developers.google.com/machine-learning/glossary#context-window>
- <https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence>

## Narration: Worked Example Harborview

This fictional Harborview scenario allows us to apply the three labels. The instruction requests a two-sentence public announcement using only the fact sheet, without inferring missing details. The fact sheet gives the event name, Harborview Reading Day; the date, 2026-10-03; the venue, North Library, 8 Cedar Lane; doors at 09:30; a program from 10:00 to 12:00; required registration; and a 2026-09-28 deadline. It does not state a fee, accessibility features, eligibility, an organizer, or a registration method. The candidate correctly names the event, venue, address, date, door time, program time, and deadline. It also says free, fully wheelchair-accessible, everyone can register, and registration happens by emailing the library. Those four additions are not established. They are not contradicted, because the sheet supplies neither a positive nor a negative answer. Keep the supported details and disclose the missing ones. A compliant revision is: Harborview Reading Day takes place on 2026-10-03 at North Library, 8 Cedar Lane; doors open at 09:30 and the program runs from 10:00 to 12:00. Registration is required by 2026-09-28, while the fee, accessibility features, eligibility, and registration method are not provided in the fact sheet. This revision preserves evidence without converting familiar event wording into facts.

Sources:

- <https://developers.google.com/machine-learning/glossary#hallucination>
- <https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence>

## Checkpoint: Worked Example Checkpoint

Why should the unstated fee be labeled not established rather than free or not free? Also identify the correct label for the unsupported accessibility, eligibility, and email claims. Use only the fictional fact sheet, and do not add outside knowledge.

Expected learner action: Label the fee, accessibility, eligibility, and email claims not established and explain that the fact sheet settles neither positive nor negative versions.

Sources:

- <https://developers.google.com/machine-learning/glossary#hallucination>

## Feedback: Worked Example Feedback

The fee is not established because the fact sheet is silent about it. Silence supports neither free nor paid. The same reasoning applies to accessibility, eligibility, and email registration. None is established, and none is explicitly contradicted. A strong correction keeps the date, venue, times, registration requirement, and deadline, then says the missing categories are not provided. If you invented a negative claim, such as not accessible, revise it to an unknown.

Correct feedback: You treated absent information as not established and retained the supported Harborview details.

Retry feedback: Do not turn missing information into either a positive or negative fact. Revise each unsupported claim to not established.

Sources:

- <https://developers.google.com/machine-learning/glossary#hallucination>

## Narration: Learner Variation Narration

For your practice, use only the fictional Bicycle Basics materials. The workshop date is 2026-11-14, from 14:00 to 15:30. The full venue is Workshop Room 2, Cedar Community Center, 40 Pine Street. Participants must bring a bicycle helmet. Capacity is 18 participants, and registration closes on 2026-11-10. The sheet does not state a fee, age range, accessibility features, registration method, or bicycle requirement. The candidate has three bullets. It calls the workshop free and for all ages. It gives the supported date and time. It gives the full venue and says to bring both a bicycle and helmet. Its final bullet says the accessible workshop accepts the first 25 people who email registration by the deadline. Split every statement into a claim. Label each supported, contradicted, or not established. Explain each correction, then write exactly three corrected bullets. Include the exact date, time, full venue, helmet requirement, capacity of 18, and deadline. Do not add a weekday or outside facts.

Sources:

- <https://developers.google.com/machine-learning/glossary#hallucination>
- <https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence>

## Learner Prompt: Learner Variation Prompt

Complete the evidence audit now. First, list each claim with its label, reason, and correction. Second, write exactly three bullets containing all requested supported details. Third, note one fluent phrase that sounded plausible but lacked evidence. No account, software, internet, or outside information is needed.

Expected learner action: Create a claim-by-claim audit, a corrected three-bullet notice, and a note identifying one plausible unsupported phrase.

## Pause: Activity Work Time

## Narration: Learner Answer Key Narration

Compare labels before prose. In bullet one, Bicycle Basics, the date, and the time are supported. Free is not established because no fee appears. For all ages is not established because no age range appears. In bullet two, Workshop Room 2, Cedar Community Center, 40 Pine Street, and the helmet requirement are supported. A bicycle requirement is not established; the sheet requires only a bicycle helmet. In bullet three, the deadline is supported. A capacity of 25 is contradicted by the explicit capacity of 18. Accessibility, first-come ordering, and email registration are not established. The corrected answer is: First bullet: Bicycle Basics is scheduled for 2026-11-14 from 14:00 to 15:30 in Workshop Room 2, Cedar Community Center, 40 Pine Street. Second bullet: Participants must bring a bicycle helmet; the workshop capacity is 18 participants. Third bullet: Registration closes on 2026-11-10; the fee, age range, accessibility features, registration method, and any requirement to bring a bicycle are not provided. This answer has exactly three bullets, preserves every requested supported fact, replaces the contradicted number, and discloses unsupported additions.

Sources:

- <https://developers.google.com/machine-learning/glossary#hallucination>
- <https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence>

## Checkpoint: Answer Key Checkpoint

Check your labels. If you called 25 not established, change it to contradicted because 18 is explicit. If you called free or accessible false, change those labels to not established. Then confirm that your three bullets retain the helmet, capacity, and deadline.

Expected learner action: Correct any labels, remove invented positive or negative claims, and restore any omitted helmet, capacity, or deadline details.

Sources:

- <https://developers.google.com/machine-learning/glossary#hallucination>

## Feedback: Answer Key Feedback

If your answer changed only 25 to 18, it is incomplete. Remove or disclose free, all ages, accessible, bicycle required, first-come, and email because none is established. If you wrote not accessible or bicycles are forbidden, revise those invented negatives to not provided. If you omitted the helmet, capacity, or deadline, restore it because the user requested those supported details. A correct audit distinguishes explicit conflict from missing evidence and preserves every requested fact.

Correct feedback: Your answer replaces 25 with 18, removes or discloses every unsupported addition, and preserves all requested supported facts.

Retry feedback: Review each candidate phrase separately. Correct the contradicted capacity, mark absent categories not established, and restore every requested supported detail.

Sources:

- <https://developers.google.com/machine-learning/glossary#hallucination>

## Narration: Fluency Verification Narration

A hallucination is plausible-seeming but factually incorrect output that purports to assert something about the real world. Even before a claim is proven false, an unsupported claim should not be treated as established merely because it is fluent. Tone is generated language, not a certificate of accuracy. Words such as certainly, definitely, or probably do not reveal a measured confidence score. For factual tasks, verify individual claims against authoritative evidence, relevant tests, or checked tool results. Record unknowns instead of filling them with likely-sounding details. Match the review level to the consequences of error. The NIST Generative AI Profile provides risk-management guidance for generative AI. Our narrower practice is to trace each claim to supplied evidence. The final mental model is simple: training adjusts parameters; inference uses the trained model; prompts and context condition the response; generation proceeds through token choices; and external evidence establishes factual correctness. Better prompts clarify boundaries but do not guarantee truth.

Sources:

- <https://developers.google.com/machine-learning/glossary#hallucination>
- <https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence>

## Transition: Activity Transition

You are ready to complete activity-evidence-audit. Submit a claim-by-claim list with labels, reasons, and corrections; a corrected three-bullet notice with every requested supported detail; and a brief note naming one plausible phrase that lacked evidence. Compare your work with the learner variation answer key. If labels differ, remember that explicit conflict means contradicted, while absent evidence means not established.

Sources:

- <https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence>

## Assessment Handoff: Assessment Handoff

Before the knowledge check, recap the five objectives. Training adjusts parameters, while inference uses a trained model with current input. Generation selects tokens repeatedly from context. Tokens are model-specific units and are not necessarily words. Factual claims can be supported, contradicted, or not established by supplied evidence. A fluent unsupported answer should be corrected without inventing what is missing. The eight questions also check context windows, the toy lookup, fee evidence, workshop capacity, and accessibility information. Review any section or the transcript before you begin.

Sources:

- <https://developers.google.com/machine-learning/glossary#training>
- <https://developers.google.com/machine-learning/glossary#inference>
- <https://developers.google.com/machine-learning/glossary#token>
- <https://developers.google.com/machine-learning/glossary#context-window>
- <https://developers.google.com/machine-learning/glossary#hallucination>

## Closing: Class Closing

Keep the shortest version with you: training creates parameters, inference uses them, generation produces likely continuations, and evidence determines factual support. Confident tone and verified correctness are different properties. When a detail is missing, mark it unknown or obtain evidence instead of guessing.

Sources:

- <https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence>
