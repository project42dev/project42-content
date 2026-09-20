# Expose a Model Service without Hiding Its Contract: text-only class

This route contains the complete teaching content, learner actions, feedback,
and assessment handoff without requiring audio, video, or animation.

## Welcome: Welcome And Outcomes

Welcome. This class turns a running model process into a service contract an application can depend on and an operator can replace safely. You will separate serving layers, distinguish process health from exact-model readiness, define inference and failure behavior before traffic arrives, test compatibility as a bounded subset, and preserve a portable adapter with a reversible cutover. One successful chat request is a demonstration, not a compatibility proof.

## Narration: Serving Layers Narration

Separate the layers and give each one a visible responsibility. The model runtime loads and executes the artifact. The inference server exposes runtime operations through a network protocol. A gateway authenticates callers, authorizes operations, applies body, rate, concurrency, and cost limits, routes requests, records policy decisions, and provides a stable external name. The application adapter maps product-owned requests, outcomes, errors, and telemetry to a selected serving protocol. The public contract is what approved clients may rely on. Keep identity, authorization, and policy outside model prompts. Do not let replacing a runtime silently change learner-facing behavior or weaken access controls. Bind every friendly served-model name to the exact immutable model and runtime bundle. Responses, traces, evaluations, incidents, and rollback records preserve that underlying identity even when clients use an alias.

Visual alternative: The public contract sits above an application adapter, gateway, inference server, and runtime. Each row lists owned and forbidden responsibilities.

Sources:

- <https://kserve.github.io/website/docs/concepts/architecture/data-plane/v2-protocol>
- <https://docs.vllm.ai/en/latest/serving/online_serving/openai_compatible_server/>

## Demonstration: Layer Demonstration

Consider an application that submits a document question and expects a structured answer, cited evidence, one stable error taxonomy, and an audit identifier. Runtime A uses one chat field and one streaming event shape. Runtime B uses different field names and emits usage only at the end. The application should not learn both protocols. Two adapters map the same product request and outcome contract while the gateway enforces the same identity and limits. If Runtime B cannot preserve a required citation, cancellation, or error behavior, the adapter reports the capability unavailable. It must not fabricate equivalence or silently drop the field.

Visual alternative: Both adapters preserve required application behavior; a runtime that cannot support a required cancellation or evidence field is labeled unavailable rather than treated as equivalent.

Sources:

- <https://docs.vllm.ai/en/latest/serving/online_serving/openai_compatible_server/>
- <https://developers.openai.com/api/reference/resources/chat/subresources/completions/methods/create>

## Narration: Health Identity Narration

Define health states separately. Liveness asks whether the server process is functioning enough that the supervisor should leave it running. It should not fail merely because every downstream dependency is unavailable. Instance readiness asks whether this instance should receive inference traffic. Model readiness confirms that the intended model and exact version are loaded and can serve the required contract. Model metadata exposes the served identity and supported contract without revealing credentials, internal paths, or unnecessary infrastructure. KServe's Open Inference Protocol version two separates server live, server ready, model ready, model metadata, and inference endpoints. Whatever protocol you choose, test startup, artifact loading, warm-up, pressure, dependency failure, unload, update, rollback, and shutdown transitions. A process can return HTTP two hundred while the wrong model, wrong adapter, or incomplete warm-up is present. That process may be live and still must not be ready.

Visual alternative: During startup, pressure, update, and rollback, each health state has a separate result. A live process with the wrong model is not ready.

Sources:

- <https://kserve.github.io/website/docs/concepts/architecture/data-plane/v2-protocol>
- <https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/>

## Checkpoint: Readiness Checkpoint

Checkpoint. The server process responds to its health endpoint, but telemetry shows it loaded the previous model revision after an update. Should it be live, ready, both, or neither, and what must happen next?

Learner action: Classify the process as potentially live but not ready, remove it from inference routing, and reconcile or restore the approved exact bundle.

Sources:

- <https://kserve.github.io/website/docs/concepts/architecture/data-plane/v2-protocol>

## Pause: Readiness Response Time

## Feedback: Readiness Feedback

A strong answer says the process may be live because it responds, but it is not model-ready for the approved contract. Remove it from inference routing, preserve exact identity evidence, reconcile why the prior revision loaded, then load or restore a verified bundle and repeat readiness and conformance checks. Restarting without identifying the bundle can repeat the same failure. If your answer marked it ready because the port opened, revise the rule: readiness includes the intended model identity and contract.

If correct: You separated process health from model readiness and required exact-bundle reconciliation before routing.

If retrying: Include the intended model identity and serving contract in the readiness decision.

Sources:

- <https://kserve.github.io/website/docs/concepts/architecture/data-plane/v2-protocol>
- <https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/>

## Narration: Inference Contract Narration

Own the inference and failure contract. Version allowed fields, roles or input parts, modalities, encodings, context and output limits, sampling controls, stop rules, optional tools, response schema, exact model identity, usage accounting, finish reasons, policy outcomes, and extension fields. Reject unsupported or ambiguous inputs instead of ignoring them. Define authentication and object authorization outside the prompt. Specify request and correlation identifiers, body limits, deadlines, cancellation, streaming event order, disconnect behavior, queue and rate limits, overload status, retryability, stable error codes, telemetry identifiers, redaction, and postconditions. A timeout does not automatically prove that no work occurred. A retry policy must classify the failure, reconcile any external effect, and remain bounded. One overloaded client must not multiply load through unbounded retries.

Visual alternative: Unsupported fields are rejected or explicitly transformed, and every timeout, cancellation, overload, and error has stable semantics.

Sources:

- <https://developers.openai.com/api/reference/resources/chat/subresources/completions/methods/create>
- <https://kserve.github.io/website/docs/concepts/architecture/data-plane/v2-protocol>

## Narration: Compatibility Narration

Treat compatibility as a tested subset. A server described as OpenAI-compatible may implement selected paths and fields while differing in model discovery, roles, tools, structured output, streaming chunks, token accounting, errors, limits, extensions, or parameter handling. vLLM documents an OpenAI-compatible server, but application compatibility still depends on the exact vLLM version, endpoint, model, configuration, and features the application uses. Build a conformance matrix for the product-owned subset. Label every behavior required, transformed, ignored, emulated, rejected, or unavailable. Test normal, boundary, invalid, unauthorized, rate-limited, overloaded, timeout, cancellation, streaming, restart, and recovery cases. Verify status, body, event sequence, identity, usage, error category, and telemetry. Never infer full equivalence from matching URL paths or one successful response.

Visual alternative: Paths, roles, tools, structured output, streaming, usage, errors, limits, and extensions can differ; each required behavior receives an explicit status and test.

Sources:

- <https://docs.vllm.ai/en/latest/serving/online_serving/openai_compatible_server/>
- <https://developers.openai.com/api/reference/resources/chat/subresources/completions/methods/create>

## Narration: Adapter Cutover Narration

Keep user outcomes, application schemas, authorization policy, evaluation cases, trace fields, postconditions, error categories, and recovery rules above runtime adapters. Put server-specific field names, streaming events, tool formats, and extensions inside adapters. Portability does not mean hiding important differences behind the lowest common denominator. Expose capabilities and safety differences explicitly. For a runtime change, run identical conformance and evaluation suites against baseline and candidate. Compare quality, security, latency, capacity, streaming, cancellation, failures, and observability. Canary a bounded route, preserve exact identities in telemetry, and retain the last verified adapter and serving bundle. Roll back on any critical contract, quality, security, performance, capacity, or evidence regression.

Visual alternative: A bounded canary compares exact identities and stops on contract, quality, security, latency, capacity, or observability regression while preserving rollback.

Sources:

- <https://docs.vllm.ai/en/latest/serving/online_serving/openai_compatible_server/>
- <https://kserve.github.io/website/docs/concepts/architecture/data-plane/v2-protocol>

## Narration: Serving Practical Run Pinned Cpu Service Narration

Run the lab as a controlled identity exercise, not as a performance demonstration. The qualified target is Windows x64 with PowerShell 7.6.6, .NET 10.0.12, and Python 3.13.9 using normal module-import configuration. Require PowerShell 7.6 or later; other versions are not independently qualified. The setup module verifies the pinned runtime archive, the model file, and the complete runtime DLL tree inside a controlled workspace. The runtime asset is llama-b10964-bin-win-cpu-x64.zip, with its exact size, SHA-256 pin, and commit recorded in the displayed identity table. The model is Qwen3-0.6B-Q8_0.gguf, with its exact size, SHA-256 pin, and revision recorded in that table. Compare the downloaded files and complete runtime DLL tree against those pins, and retain the verification result as evidence. Do not read the 64-character hashes aloud. Start the service on loopback port 11842 with alias p42-qwen3-06b. Verify identity with the client, then stop only an owned process.

Sources:

- <https://github.com/ggml-org/llama.cpp/blob/b29c606e28a01b1bc8c1351026a0fa6e616bf6c4/tools/server/README.md>
- <https://huggingface.co/Qwen/Qwen3-0.6B>

## Checkpoint: Serving Practical Run Pinned Cpu Service Checkpoint

Checkpoint. The port responds and the alias is p42-qwen3-06b, but the model hash was not recorded. Is the service ready for the conformance run? State the evidence you still need and the routing decision.

Sources:

- <https://github.com/ggml-org/llama.cpp/blob/b29c606e28a01b1bc8c1351026a0fa6e616bf6c4/tools/server/README.md>

## Pause: Serving Practical Run Pinned Cpu Service Pause

Visual alternative: Keep the pin table and three answer fields static. Use text labels for pause, extend, and continue.

## Feedback: Serving Practical Run Pinned Cpu Service Feedback

The service may be live, but it is not ready for this evidence boundary. Require the model SHA-256, model revision, runtime hash and commit, complete runtime tree verification, and authenticated identity evidence before routing it into conformance. The observed alias is useful labeling, not cryptographic artifact proof. If you treated a responding port or matching alias as sufficient, the causal error is confusing process reachability with exact artifact identity. Record the hashes separately from client behavior, then rerun readiness and conformance against the verified bundle.

If correct: You withheld routing until exact runtime and model identity evidence was available.

If retrying: A live port and alias do not prove the pinned artifacts. Name the hashes and revisions required before routing.

Sources:

- <https://github.com/ggml-org/llama.cpp/blob/b29c606e28a01b1bc8c1351026a0fa6e616bf6c4/tools/server/README.md>

## Narration: Serving Practical Collect Live Conformance Narration

Collect behavior evidence with the pinned service, while keeping scope precise. One observed run exited zero and recorded nine named observations: public health, wrong-key rejection, alias identity, bounded completion, a stream with terminal DONE and text, early disconnect, recovery after disconnect, a client timeout, and an overload sample. Treat this as one observed run, not implementation-history evidence or a benchmark. Missing-key 401 behavior was verified separately. This is one qualifying run, not a benchmark. The ordinary budget is 30 seconds and the streaming bound is 30 seconds. The deliberate client timeout is 50 milliseconds, and the overload sample uses a 12-second condition. Generation and timing are nondeterministic, so neither content length nor duration is guaranteed. Early disconnect proves client closure was exercised, not server-side cancellation. Four sampled concurrent outcomes do not establish queue, capacity, gateway, or rate-limit guarantees. Record status, body or event evidence, identity, and limitation for every observation. Hash and restart evidence remain separate evidence classes.

Sources:

- <https://github.com/ggml-org/llama.cpp/blob/b29c606e28a01b1bc8c1351026a0fa6e616bf6c4/tools/server/README.md>

## Demonstration: Serving Practical Collect Live Conformance Demonstration

Watch the instructor open the client receipt and classify each row. Health is an HTTP 200 observation, not an authentication test. Wrong-key rejection is an authenticated 401 observation. The stream row contains terminal DONE and nonempty text. The early-disconnect row says the client closed after a response byte and explicitly says server cancellation was not observed. The overload row contains four sampled 200 outcomes and no capacity guarantee. The instructor now places each row into observed, not-observed, or not-proven columns. Notice that a successful row is not expanded into a stronger claim. This is the same discipline you will apply to your own evidence table.

Sources:

- <https://github.com/ggml-org/llama.cpp/blob/b29c606e28a01b1bc8c1351026a0fa6e616bf6c4/tools/server/README.md>

## Narration: Serving Practical Diagnose Contract Failures Narration

Diagnose a failure by tracing the first violated contract, not by treating every symptom as a model failure. A public health success establishes reachability only. A 401 from an authenticated endpoint establishes rejection for that supplied credential, not universal authentication coverage. A client timeout establishes that the client deadline expired; it does not establish server cancellation or absence of work. A stream ending with DONE and text supports that observed exchange, but not every streaming edge case. A wrong model revision is an identity and readiness failure even if generation succeeds. An occupied port is a lifecycle setup failure, while an unrelated PID on that port is an ownership safety failure. The qualified lifecycle negatives include existing-file preservation, corrupted archive, occupied port, and refusal to stop an unrelated PID. The positive sequence is start, same-key identity, owned stop, restart, same-key identity, and owned stop. Diagnose the cause, preserve the failed evidence, choose hold, repair, and rerun the smallest affected gate.

Sources:

- <https://github.com/ggml-org/llama.cpp/blob/b29c606e28a01b1bc8c1351026a0fa6e616bf6c4/tools/server/README.md>
- <https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/>

## Checkpoint: Serving Practical Diagnose Contract Failures Checkpoint

Checkpoint. A client deadline expires after the server has accepted a request. The client then reconnects successfully. What can you claim, what must remain unknown, and what evidence should you collect before calling this recovery?

Sources:

- <https://github.com/ggml-org/llama.cpp/blob/b29c606e28a01b1bc8c1351026a0fa6e616bf6c4/tools/server/README.md>

## Pause: Serving Practical Diagnose Contract Failures Pause

Visual alternative: Show the timeout event, reconnect event, and three static answer columns. Do not animate a request lifecycle.

## Feedback: Serving Practical Diagnose Contract Failures Feedback

You can claim that the client deadline expired and that a later client request recovered, if that later request has its own observed evidence. You must not claim that the server cancelled the first request, that no work occurred, or that the system has a general cancellation guarantee. Collect server-owned cancellation telemetry before making that claim. A common wrong answer calls reconnect success proof that the timed-out work stopped. That confuses client observation with server state and can make retries multiply work. Hold any cancellation or retry conclusion, preserve both receipts, classify the timeout, and rerun the relevant bounded recovery case.

If correct: You separated client timeout, later recovery, and unobserved server cancellation.

If retrying: A client deadline is not server cancellation. State the missing server-owned evidence.

Sources:

- <https://github.com/ggml-org/llama.cpp/blob/b29c606e28a01b1bc8c1351026a0fa6e616bf6c4/tools/server/README.md>

## Narration: Serving Practical Compare Two Adapters Narration

Compare adapters at the application contract boundary. The offline exercise uses two explicitly fictional adapters, not two real servers. Both receive the same three semantic fixtures and preserve exactly four application fields: requestId, category, explanation, and modelArtifactId. Adapter A maps these to ticket_id, kind, reason, and artifact. Adapter B maps them to id, label, description, and model_id, trimming explanation as its documented transformation. Both reject unknown fields, unsupported tools, malformed values, identity mismatches, and caller-input mutation. The six-row matrix must label required, transformed, rejected, and unavailable behavior. A BrokenCandidate erases explanation and therefore returns HOLD because a required user-visible outcome disappeared. A corrected candidate can be OFFLINE_ELIGIBLE only within the synthetic fixture scope. That label is never deployment authorization. The gate also checks complete fixture coverage, exact identities, metrics, evidence label, latency and error regressions, and rollback. The restored adapter must rerun every original fixture and match expected normalized results.

Sources:

- <https://docs.python.org/3/library/unittest.html>
- <https://docs.python.org/3/library/copy.html>
- <https://docs.python.org/3/library/math.html#math.isfinite>
- <https://github.com/ggml-org/llama.cpp/blob/b29c606e28a01b1bc8c1351026a0fa6e616bf6c4/tools/server/README.md>

## Checkpoint: Serving Practical Compare Two Adapters Checkpoint

Checkpoint. Candidate B uses different wire names but preserves all four semantic fields. Candidate C accepts the request but drops explanation and reports a matching model alias. Which candidate can pass the offline gate, and why does the other candidate remain HOLD? Include the deployment-authorization boundary.

Sources:

- <https://docs.python.org/3/library/unittest.html>
- <https://github.com/ggml-org/llama.cpp/blob/b29c606e28a01b1bc8c1351026a0fa6e616bf6c4/tools/server/README.md>

## Pause: Serving Practical Compare Two Adapters Pause

Visual alternative: Present the candidate comparison as a static table with no animated arrows. Keep the causal answer fields visible.

## Feedback: Serving Practical Compare Two Adapters Feedback

Candidate B may reach OFFLINE_ELIGIBLE when the complete synthetic matrix, exact identities, metrics, and evidence rules pass. Candidate C remains HOLD because dropping explanation changes a required application outcome. A matching alias cannot repair that loss, and an offline result cannot authorize deployment. A common wrong answer treats field spelling as the main issue. The causal issue is whether normalization preserves the semantic contract and artifact identity. Expected action: inspect normalized output, verify all fixture IDs and identities, then run rollback and compare every restored result.

If correct: You distinguished harmless wire-field differences from loss of a required semantic field and did not equate offline eligibility with authorization.

If retrying: Dropping explanation is a user-visible contract failure. The alias is not artifact proof, and offline eligibility is not deployment authorization.

Sources:

- <https://docs.python.org/3/library/unittest.html>
- <https://github.com/ggml-org/llama.cpp/blob/b29c606e28a01b1bc8c1351026a0fa6e616bf6c4/tools/server/README.md>

## Narration: Serving Practical Practice Changed Contract Narration

Now change the contract deliberately. The new account-recovery requirement adds a confidential boolean and a transport label, but the application must expose a normalized four-field result with escalated category and no confidential field. In map_request, accept the optional confidential field only as an actual Boolean, not integer one. An omitted field or confidential=false is backward-compatible for any original category. Only confidential=true requires category account_recovery and the derived transport label confidential_account_recovery. In normalize_response, when the field was supplied, require the same Boolean and the corresponding label, preserve requestId and modelArtifactId exactly, and reject missing, altered, or extra data. Return the normalized four-field result without confidential. The protected harness substitutes the learner's ChangedAdapter class before tests run. The original AdapterB is expected to reject the changed confidential account-recovery request, and that passing rejection is reported as ContractError, not as model-capability failure. Implement the changed adapter in a new practice folder, and require the learner's implementation to pass the protected changed tests. Keep the original four-field base cases unchanged. Run the protected changed tests after the attempt, then compare the answer implementation separately. This demonstrates a real contract delta without editing canonical tests.

Sources:

- <https://docs.python.org/3/library/unittest.html>
- <https://docs.python.org/3/library/copy.html>

## Checkpoint: Serving Practical Practice Changed Contract Checkpoint

Checkpoint. A request has category account_recovery and confidential set to integer 1. Should the ChangedAdapter escalate it? Name the validation result and the reason, then state what a valid changed request would produce.

Sources:

- <https://docs.python.org/3/library/unittest.html>

## Pause: Serving Practical Practice Changed Contract Pause

Visual alternative: Show the request fields and expected output as static text. Do not imply live code execution or automatic test feedback.

## Feedback: Serving Practical Practice Changed Contract Feedback

Reject integer 1. The requirement is an actual Boolean, and accepting a numerically similar value creates an ambiguous contract. A valid confidential request uses confidential=true with category account_recovery, produces transport label confidential_account_recovery, carries the same Boolean flag in the transport result, and normalizes to the required four fields with the escalated category and no confidential field. An omitted flag or confidential=false remains valid for any original category and does not require escalation. A common wrong answer accepts any truthy value or lets the caller directly supply the escalated category. Expected action: validate type and category before mapping, derive the transport label rather than trusting caller input, and preserve the original base cases. Then run the protected changed tests and inspect the ContractError expectation for the original adapter.

If correct: You enforced actual Boolean typing, derived escalation from the permitted category, and preserved the four-field normalized output.

If retrying: Integer 1 is not an actual Boolean here. The adapter must derive the transport label and reject caller-supplied ambiguity.

Sources:

- <https://docs.python.org/3/library/unittest.html>

## Narration: Serving Practical Rehearse Owned Recovery Narration

Rehearse recovery as an ownership proof, not a kill-by-port shortcut. The lifecycle helper records process PID, executable path, and startTimeUtc, then compares the observed start instant within a one-second tolerance before stopping. This protects an unrelated process that happens to use the port. Tests cover UTC helper behavior, including JSON date-time round trips, offset strings, and malformed values, because timezone information can be lost if parsing is careless. Setup creates all paths inside the controlled workspace, avoids temporary directories, and verifies cache and actual HTTPS download paths. Setup does not generate the lifecycle API secret. The caller commands generate one key and hold that same key across Start, client, and Stop; nested cleanup removes it after an owned stop. Exercise the changed-port boundary on 11901: the old port 11842 should produce ConnectionRefused, while other errors are not proof. Obtain a fresh receipt, verify ownership and identity, stop the client, and stop the owned server. Retain the full cutover matrix, safety, latency, and observability gates. A synthetic eligibility result never authorizes deployment. Loopback does not implement TLS, multiuser authentication, gateway limits, or production audit.

Sources:

- <https://github.com/ggml-org/llama.cpp/blob/b29c606e28a01b1bc8c1351026a0fa6e616bf6c4/tools/server/README.md>

## Checkpoint: Serving Practical Rehearse Owned Recovery Checkpoint

Checkpoint. Port 11842 is occupied by a process with a different executable path, while the recorded service PID is gone. What should the stop operation do, and what evidence is needed before retrying recovery?

Sources:

- <https://github.com/ggml-org/llama.cpp/blob/b29c606e28a01b1bc8c1351026a0fa6e616bf6c4/tools/server/README.md>

## Pause: Serving Practical Rehearse Owned Recovery Pause

Visual alternative: Show the recorded and observed PID, path, start time, and port in a static comparison table.

## Feedback: Serving Practical Rehearse Owned Recovery Feedback

Refuse the stop. A matching port is not ownership. Preserve the occupied-port and unrelated-PID evidence, report the mismatch, and do not terminate that process. Before retrying, establish a newly started owned service with matching PID, executable path, and startTimeUtc within the one-second comparison tolerance, then collect a fresh authenticated identity receipt. A common wrong answer force-stops whatever owns the port. That can interrupt unrelated work and destroys the lifecycle safety boundary. Expected action: resolve the conflict outside the helper, rerun the ownership-checked start and identity sequence, and perform cleanup only through the owned-stop path.

If correct: You refused to stop an unrelated process and required fresh ownership evidence before recovery.

If retrying: The port does not establish ownership. Compare PID, executable path, and startTimeUtc, and preserve the refusal evidence.

Sources:

- <https://github.com/ggml-org/llama.cpp/blob/b29c606e28a01b1bc8c1351026a0fa6e616bf6c4/tools/server/README.md>

## Learner Prompt: Activity Transition

Now perform the practical serving exercise. First run the pinned CPU service in the named lab module, verify the exact runtime and model assets, and collect the live client receipt. Then diagnose each observation by its contract boundary. Next run the two fictional adapters over the same semantic fixtures, implement the changed account-recovery requirement in the practice copy, and rehearse the owned lifecycle and changed-port boundary. Your deliverable is evidence, not a claim of production readiness: an identity record, conformance classification, causal failure notes, changed-task test result, rollback result, and explicit unknowns. Keep the original five core sections intact: separate serving layers, define health and identity, own the inference contract, test a compatibility subset, and preserve a portable adapter.

Learner action: Run the pinned service and exercises, preserve receipts and failures, classify known and unknown behavior, implement the changed adapter in the practice copy, and produce reversible cutover evidence.

Sources:

- <https://github.com/ggml-org/llama.cpp/blob/b29c606e28a01b1bc8c1351026a0fa6e616bf6c4/tools/server/README.md>
- <https://docs.python.org/3/library/unittest.html>

## Pause: Activity Work Time

Visual alternative: Display the evidence checklist and named files as static text. Controls are represented by labels for pause, extend, save, and continue, without animated UI claims.

# Reduced-motion practical equivalent

All activities can be completed from static text, tables, transcript, and learner-entered notes. No animated server diagram, live dashboard, automatic test result, or imagined control is required. Use the named module and assets, but do not reproduce command blocks. Keep exact 64-character hashes in static tables or learner records, not in spoken narration.

## Static field mapping and evidence table

| Exercise stage | Inputs or evidence | Learner action | Boundary to preserve |
|---|---|---|---|
| Pinned setup | Runtime archive and model names, hashes, revisions, complete DLL tree | Compare recorded values and mark ready only after exact evidence | Alias and open port do not prove artifact identity |
| Live client | Nine named observations plus separate missing-key 401 | Record observed result and limitation | One qualifying run is not a benchmark |
| Timeout | Client deadline and later request receipt | Separate client fact, server unknown, and recovery evidence | Timeout does not prove cancellation |
| Lifecycle | PID, executable path, startTimeUtc, port, and caller-held key | Stop only an owned process within one-second start tolerance | Refuse unrelated PID or path |
| Adapter matrix | Six rows, three fixtures, two fictional adapters | Compare normalized semantic outcomes | Wire differences are acceptable only when behavior is preserved |
| Changed task | Actual Boolean, account-recovery category, derived label | Implement and test ChangedAdapter | Original adapter rejection is ContractError, not model failure |
| Mutation task | Practice copies and unchanged canonical tests | Remove one guard, observe failure, restore, run all eight | Never edit canonical tests |
| Rollback | Prior immutable-style reference and every original fixture | Restore and rerun all fixtures | `OFFLINE_ELIGIBLE` is never deployment authorization |

## Static checkpoints

### Checkpoint 1: readiness
A port responds and the alias matches, but the model hash is absent. **Answer after attempting:** live may be supported; readiness and routing are held until model and runtime hashes, revisions, complete-tree verification, and authenticated identity evidence exist.

### Checkpoint 2: timeout
A client deadline expires and a later request succeeds. **Answer after attempting:** the deadline and later receipt are observations. Server cancellation and absence of first-request work remain unknown. Obtain server-owned cancellation evidence before claiming cancellation.

### Checkpoint 3: adapters
B changes wire fields but preserves all four semantic fields. C drops explanation and reports a matching alias. **Answer after attempting:** B can be `OFFLINE_ELIGIBLE` only within complete synthetic gates. C is `HOLD` because a required outcome was lost. Neither authorizes deployment.

### Checkpoint 4: ownership
A different executable owns the expected port and the recorded PID is gone. **Answer after attempting:** refuse to stop. Preserve evidence, resolve the conflict outside the helper, create a newly owned service, obtain a fresh receipt, and retry ownership-checked recovery.

## Learner work sequence

1. Verify Windows x64, PowerShell 7.6.6 or later, .NET 10.0.12, Python 3.13.9, pinned assets, hashes, revisions, and full runtime tree.
2. Start the loopback service on 11842, collect identity and client v5 evidence, and record every unknown boundary.
3. Run lifecycle negatives and the start, identity, stop, restart, identity, stop sequence.
4. Run both fictional adapters over the same three fixtures and inspect normalized results, six matrix rows, exact identities, metrics, evidence label, and rollback rerun.
5. Create the new practice folder, perform the exact missing-`DONE` mutation and restoration, then implement ChangedAdapter and pass the protected changed tests. The original adapter's expected ContractError is a passing contract-test result, not a substitute for passing the changed implementation.
6. Exercise port 11901 and retain fresh receipt and ownership evidence.
7. Submit the evidence table and debrief, including that TLS, multiuser authentication, gateway rate limits, production audit, and server-side cancellation are outside observed scope.

## Expected evidence and answers

The live receipt should retain the nine named observations, with server-side cancellation marked not observed. The adapter exercise should produce six matrix rows, three fixtures, six adapter runs, HOLD for the flawed candidate, OFFLINE_ELIGIBLE for the corrected candidate when all synthetic gates pass, and rollback with rerun count three. The changed task must show actual Boolean validation, derived confidential account-recovery transport labeling, four-field normalized output without a confidential field, original base-case preservation, and the original adapter's expected ContractError. The mutation exercise must show expected failure after removing only the exact guard and all eight tests after restoration.

**Sources:** [pinned llama.cpp server documentation](https://github.com/ggml-org/llama.cpp/blob/b29c606e28a01b1bc8c1351026a0fa6e616bf6c4/tools/server/README.md), [Qwen3 model page](https://huggingface.co/Qwen/Qwen3-0.6B), [Python unittest](https://docs.python.org/3/library/unittest.html), [Python deepcopy](https://docs.python.org/3/library/copy.html), and [Python isfinite](https://docs.python.org/3/library/math.html#math.isfinite).

Learner action: # Practical serving lab: text-only equivalent

Use the named module `modules/self-hosted-model-operations/lab/serving-contract/`. Do not copy or retype command blocks from this supplement. Select the module's documented setup, client v5, lifecycle, conformance, adapter, and changed-task entry points.

## 1. Run the pinned CPU service

Work on Windows x64 with PowerShell 7.6.6 or later, .NET 10.0.12, and Python 3.13.9. Other PowerShell versions are not independently qualified. Verify these named assets and their evidence separately:

| Field | Required value or boundary |
|---|---|
| Runtime | `llama-b10964-bin-win-cpu-x64.zip`, 18,427,629 bytes, commit `b29c606e28a01b1bc8c1351026a0fa6e616bf6c4`, SHA-256 `917f39c076402c421224824607397af20f53625a60defc20e8dd22446bf4c5d7` |
| Model | `Qwen3-0.6B-Q8_0.gguf`, 639,446,688 bytes, revision `23749fefcc72300e3a2ad315e1317431b06b590a`, SHA-256 `9465e63a22add5354d9bb4b99e90117043c7124007664907259bd16d043bb031` |
| Service | Windows x64 loopback, port `11842`, alias `p42-qwen3-06b` |
| Setup boundary | Complete runtime DLL tree, controlled workspace, no temporary directory, cache and actual HTTPS download paths verified |

Have the caller commands generate one lifecycle API secret, retain that same key across Start, client, and Stop for the owned lifecycle, and remove it after owned stop in nested cleanup. Setup does not generate this secret.

### Checkpoint A
A port response and expected alias are present, but the model hash is absent. Mark the service live or ready, list missing evidence, and choose a routing action.

**Pause:** spend 60 seconds or extend as needed.

**Answer:** It may be live, but hold readiness and routing. Collect the model and runtime hashes, revisions, complete-tree verification, and authenticated identity evidence. An alias is not cryptographic artifact proof.

## 2. Collect live conformance

Run the client and record the nine named observations: health, wrong-key rejection, alias, bounded completion, stream with `DONE` and text, early disconnect, recovery, client timeout, and overload sample. This is one observed run; server-side cancellation remains unknown. Keep setup and restart ownership evidence as an independent evidence class. Record missing-key 401 separately. The 30-second ordinary budget, 30-second stream bound, deliberate 50-millisecond timeout, and 12-second overload sample are test conditions, not performance guarantees. Nondeterministic generation and timing are never guaranteed. Four sampled concurrent outcomes do not prove queue, capacity, gateway, or rate-limit behavior. Early disconnect does not prove server-side cancellation.

Use this evidence table:

| Observation | Record | Do not claim |
|---|---|---|
| Health | status and endpoint result | authentication success |
| Wrong key | authenticated 401 | universal auth coverage |
| Stream | terminal `DONE` and text | every streaming edge case |
| Disconnect | client closure point | server cancellation |
| Timeout | client deadline expiry | no server work |
| Overload | sampled outcomes | capacity or rate-limit guarantee |

## 3. Diagnose contract failures

For each failure, identify the first violated contract, preserve the receipt, choose hold or repair, and rerun the smallest affected gate. A wrong revision is an identity and readiness failure. An occupied port is a lifecycle failure. An unrelated PID is an ownership safety failure. The qualified lifecycle negatives are existing-file preservation, corrupted archive, occupied port, and unrelated-PID refusal. The positive sequence is caller-generated key, start, same-key identity, owned stop, restart, same-key identity, and owned stop. Setup does not own secret generation.

### Checkpoint B
A client deadline expires, then a later request succeeds. State the observed facts, the unknown fact, and the evidence needed before claiming recovery.

**Pause:** spend 75 seconds or extend as needed.

**Answer:** The client deadline expired. A later request may have succeeded if it has its own receipt. Server cancellation and whether the first request continued are unknown. Server-owned cancellation telemetry and bounded recovery evidence are needed.

## 4. Compare two fictional adapters

Use the adapter exercise's three semantic fixtures with both fictional adapters. Preserve exactly `requestId`, `category`, `explanation`, and `modelArtifactId`. Adapter A maps to `ticket_id`, `kind`, `reason`, and `artifact`. Adapter B maps to `id`, `label`, `description`, and `model_id`, trimming explanation. Require six matrix rows and label required, transformed, rejected, and unavailable behavior. Reject unknown fields, unsupported tools, malformed values, mutated caller input, duplicate fixture IDs, missing or incorrect identities, Boolean metrics, nonfinite metrics, negative metrics, overflow, incomplete coverage, and consequential regressions.

The expected fixed result lines are `MATRIX_ROWS=6`, `FIXTURES=3 ADAPTER_RUNS=6 PASS`, `FLAWED_CANDIDATE=HOLD`, `CORRECTED_CANDIDATE=OFFLINE_ELIGIBLE`, and `ROLLBACK=OFFLINE_ELIGIBLE RERUN=3`. The JSON result must retain `deploymentAuthorization: false` and scope `offline synthetic fictional adapters`. Do not call this real-server compatibility or deployment approval.

### Checkpoint C
Candidate B changes wire names but preserves all four semantic fields. Candidate C drops `explanation` but reports a matching alias. Classify both.

**Pause:** spend 60 seconds or extend as needed.

**Answer:** B may be `OFFLINE_ELIGIBLE` within the synthetic scope if every gate passes. C is `HOLD` because dropping a required user-visible field changes behavior. Neither result authorizes deployment.

## 5. Practice the changed contract

Copy `conformance.py` and the unchanged tests into a new practice folder. Remove only the exact missing-`DONE` guard in the practice copy, run it to observe the expected failure, restore the guard, and obtain all eight tests passing. Do not edit canonical files.

Implement `ChangedAdapter.map_request` and `normalize_response`. Accept `confidential` only when it is an actual Boolean. Permit true only with category `account_recovery`. Derive transport label `confidential_account_recovery`; require the response to carry the same flag and escalated label. Normalize to four fields with escalated category and no confidential field. Reject unknown fields, caller-supplied escalated category, wrong IDs or artifacts, missing escalation, and malformed values. The protected harness substitutes the learner class. The original adapter should fail the changed case with `ContractError`, which is the expected passing contract-test result, not a model-capability result. The learner's ChangedAdapter must pass the protected changed tests, not merely observe the original adapter's rejection. Run the separate answer after attempting the task. Preserve original base cases.

## 6. Rehearse owned recovery

Exercise changed port `11901`. The old port `11842` should yield `ConnectionRefused`; another error is not proof. Obtain a fresh receipt, verify PID, executable path, and startTimeUtc within one second, run client start and stop with the caller-generated key held consistently, and clean up only the owned process. Retain the full cutover matrix, safety, latency, and observability gates. Loopback does not implement TLS, multiuser authentication, gateway rate limits, or production audit.

### Checkpoint D
A different executable owns the expected port and the recorded service PID is gone. The stop operation must refuse. Preserve the evidence, resolve the conflict outside the helper, establish a newly owned service, collect a fresh receipt, and retry the safe sequence.

**Pause:** spend 60 seconds or extend as needed.

**Answer:** Never stop by port alone. A matching PID, path, and start time are required. Refusal protects unrelated work.

## Evidence and debrief

Submit artifact identity, live observation table, causal diagnoses, adapter matrix and output, changed-task test evidence, mutation exercise evidence, changed-port result, fresh receipt, ownership proof, cleanup result, rollback rerun, and unknown boundaries. State explicitly that this is one qualifying run and not a benchmark. State explicitly that server-side cancellation was not observed and that synthetic eligibility is not deployment authorization.

**Sources:** [pinned llama.cpp server documentation](https://github.com/ggml-org/llama.cpp/blob/b29c606e28a01b1bc8c1351026a0fa6e616bf6c4/tools/server/README.md), [Qwen3 model page](https://huggingface.co/Qwen/Qwen3-0.6B), [Python unittest](https://docs.python.org/3/library/unittest.html), [Python deepcopy](https://docs.python.org/3/library/copy.html), and [Python isfinite](https://docs.python.org/3/library/math.html#math.isfinite). The original class sources remain context for its five core sections and cutover acceptance.

## Assessment Handoff: Assessment Handoff

Submit when your evidence shows exact artifact identity, a bounded live observation record, causal diagnosis with unknown boundaries, both fictional adapter mappings, the changed-task result, and an ownership-checked recovery rehearsal. The graded changed task must show that the protected harness substituted your ChangedAdapter, that the original adapter's expected rejection is reported as ContractError, and that original base cases remain intact. Include the mutation exercise evidence: an unchanged copy of conformance.py and tests, removal of only the exact missing-DONE guard in the practice copy, the expected failure, restoration, and all eight tests passing. Include the changed-port result, fresh receipt, ownership evidence, and cleanup. Do not convert OFFLINE_ELIGIBLE into deployment authorization. Do not claim server-side cancellation, production security, multiuser authentication, gateway rate limits, or benchmark performance unless separate evidence exists.

Learner action: Review the evidence bundle, correct unsupported claims, and choose Begin knowledge check only after the practical work is complete.

Sources:

- <https://docs.python.org/3/library/unittest.html>
- <https://github.com/ggml-org/llama.cpp/blob/b29c606e28a01b1bc8c1351026a0fa6e616bf6c4/tools/server/README.md>

## Closing: Class Closing

Carry the boundary forward: exact identity precedes readiness, client observations do not prove server cancellation, compatibility is only the tested subset, changed contracts require changed tests, and recovery must prove ownership before stopping anything. Your practical evidence should make both the successful behavior and the unknown behavior visible. Keep the adapter portable, the cutover reversible, and synthetic offline eligibility separate from deployment authorization.
