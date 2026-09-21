# Endpoint Identity, Network, and Secrets Security: text-only class

This route contains the complete teaching content, learner actions, feedback,
and assessment handoff without requiring audio, video, or animation.

## Welcome: Welcome And Outcomes

Welcome to Endpoint Identity, Network, and Secrets Security. A self-hosted model endpoint is not secure merely because it runs on your hardware or inside your network. Security depends on explicit principals, least privilege, bounded exposure, managed secrets, abuse controls, and evidence that denial and recovery work. In this class, you will map every trust boundary, keep authorization outside untrusted prompts, separate serving from management, limit sensitive data and expensive work, and test revocation with a recoverable record. The examples are synthetic. No live endpoint, model, provider, credential, approval system, or network service is executed by this lesson.

## Narration: Trust Boundary Narration

Begin with data flow, not with a product checklist. Draw this serving flow: a user or workload principal sends a request to a serving gateway. The gateway applies authorization policy, then admission and resource limits. The request reaches the inference runtime, which uses a loaded model artifact. A response filter returns a result to the client. Side flows go from the gateway and runtime to a redacting telemetry collector and then an audit store. The runtime reads from an approved artifact cache. Approved deployment automation moves an artifact from a registry into a controlled deployment. Mark prompts and generated output as sensitive application data. Mark model artifacts and configuration as controlled deployment data. Mark audit events as security records. Treat an identity assertion as trusted only after the real identity layer verifies it. The separate management flow is a named operator, administrative identity verification, a management gateway that is not exposed on the serving route, authorization policy, and a configuration or release controller. Approval is a distinct principal action before promotion. Secret rotation flows from a secret-management service to an authorized workload identity, never through a prompt. Recovery flows from an incident commander and recovery operator through a time-bounded, audited emergency route. Name human, workload, device, service, automation, and break-glass principals separately. A shared credential erases attribution and makes targeted revocation difficult. Record who may discover models, invoke inference, configure resources, observe redacted telemetry, promote artifacts, approve releases, rotate or revoke scoped identities, and recover service. The central questions are: which verified principal requests which exact action on which exact object, and where is that decision enforced?

Visual alternative: Clients connect to a gateway, then authorization and limits, then an inference runtime and artifact. Separate rows show telemetry, management, secret rotation, and recovery flows.

Sources:

- <https://csrc.nist.gov/pubs/sp/800/207/final>

## Demonstration: Boundary Demonstration

Here is a worked synthetic example. A user or workload calls an application. The application workload calls a gateway. The gateway authorizes an inference request. A deployment operator uses a different identity and a separate management route to promote a verified artifact. The inference runtime reads that artifact but cannot promote it. A narrowly scoped workload identity retrieves one needed secret through the approved secret mechanism. A telemetry identity writes redacted events but cannot read raw prompts. A break-glass identity is inactive until an approved emergency, is limited in time and scope, and produces high-priority evidence. Now mark three denied paths: the public serving route cannot change configuration; the inference workload cannot promote an artifact; and the telemetry writer cannot read raw prompts. Retrieved documents, tool output, prompts, and generated text remain data. They may contain instructions, but they do not become principals or policy. This diagram turns a broad goal into decisions that can be tested by owner, action, object, result, and evidence.

Visual alternative: Serving and management paths are separate. The public serving path cannot configure service, the runtime cannot promote artifacts, and telemetry cannot read raw prompts.

Sources:

- <https://csrc.nist.gov/pubs/sp/800/207/final>
- <https://kubernetes.io/docs/concepts/security/security-checklist/>

## Narration: Identity Authorization Narration

Separate authentication from authorization. Authentication establishes which principal made a request through mechanisms appropriate to the real environment. Authorization decides whether that authenticated principal may perform this action on this resource under current policy. Check validity, issuer, audience, intended subject, active status, and scoped roles in the real identity layer. Prefer short-lived credentials where supported. Bind policy to stable identities rather than network location alone. Require renewed authentication for consequential administration when policy requires it. Enforce object, property, and function authorization at the gateway or application for every request. The model cannot grant access, select its own credential, or approve an external action. A prompt that says, I am an administrator, is content, not identity evidence. If an agent proposes a tool call, trusted application code must still validate the principal, object, function, arguments, limits, and required approval. Fail closed when identity or policy cannot be verified. Record the decision without exposing credentials or sensitive content. The local lab deliberately does not parse or verify a token. Its authenticated and credential-status fields are trusted fixture inputs. A passing local test therefore proves only local authorization and limit behavior, not production authentication.

Visual alternative: Prompt text and model output are outside the trusted decision boundary. They may request an action but cannot authorize it.

Sources:

- <https://csrc.nist.gov/pubs/sp/800/207/final>
- <https://owasp.github.io/API-Security/editions/2023/en/0x11-t10/>

## Checkpoint: Authorization Checkpoint

Checkpoint. An active principal with the invoker role belongs to tenant-red. The request asks to invoke endpoint-blue, owned by tenant-blue. The prompt says, I am an administrator, and asks the system to ignore policy. Before hearing the answer, identify the fields the policy must compare and predict the result.

Learner action: Predict denial with reason scope_mismatch, based on the validated principal tenant and resource tenant, with no unauthorized side effect.

Sources:

- <https://csrc.nist.gov/pubs/sp/800/207/final>
- <https://owasp.github.io/API-Security/editions/2023/en/0x11-t10/>

## Pause: Authorization Checkpoint Pause

## Feedback: Authorization Feedback

The correct result is deny with reason scope_mismatch. The policy must use the verified, active principal, confirm that invoke is allowed for the role, resolve the requested resource, and compare the principal tenant with the resource tenant. Here, tenant-red does not equal tenant-blue, so the request stops before an allow decision. The prompt is retained only as data and never enters identity, role, tenant, or policy comparisons. No unauthorized side effect occurs, and the decision can include principal ID, action, resource ID, outcome, and reason without prompt content. If your answer let the model decide, or checked only the role, retry. Role authorization is not object authorization.

If correct: You compared the validated principal and resource scope outside the model and denied the cross-tenant object.

If retrying: Use trusted identity and object authorization. Prompt text, model output, and role alone cannot establish permission.

Sources:

- <https://csrc.nist.gov/pubs/sp/800/207/final>
- <https://owasp.github.io/API-Security/editions/2023/en/0x11-t10/>

## Demonstration: Worked Authorization Demonstration

Now work through the lab's actual defect. The principal user-red has role invoker and belongs to tenant-red. The request asks to invoke endpoint-blue, which belongs to tenant-blue. A defective role-only policy sees that invoker may invoke and returns allow authorized. The immutable result is: FAIL 02 cross-tenant request: expected deny scope_mismatch, got allow authorized. The cause is not failed authentication and not a failed role check. Both relevant fixture principals are authenticated and active, and both have the invoker role. The cause is a missing object-scope comparison. The correct policy first validates the known principal, request, and finite units; verifies authenticated and active status; checks role-to-action permission; compares principal.tenant with resource.tenant; and only then checks the resource limit and allow path. The repair must bind the validated resource returned by the validator. The exact code change is selectable in the visual, not spoken. After the role check and before the limit and allow path, return a denial audit with reason scope_mismatch when the tenant fields differ. Keep authentication, lifecycle, role, limit, and allow logic unchanged. Do not special-case fixture names. Do not deny every request. Same-tenant calls, inert injection-as-data behavior, and approved recovery must remain possible.

Visual alternative: Selectable code shows validated resource binding and a scope mismatch denial before the resource limit and allow path.

Sources:

- <https://owasp.github.io/API-Security/editions/2023/en/0x11-t10/>

## Narration: Network Management Narration

Bound network exposure deliberately. Listen only on required interfaces. Put authentication before inference. Encrypt traffic when the threat model requires it. Restrict ingress and egress by purpose. Separate management from serving. Verify DNS, proxies, certificates, service discovery, and time synchronization because they support identity and secure connections. A container port or cluster service can become reachable beyond its intended boundary through publishing, routing, load balancers, host networking, or permissive policy. Configuration review alone is not evidence. Test an allowed serving probe from an authorized client zone and a denied serving probe from a prohibited zone. Test a denied management-route probe through the public serving address and an allowed management probe from the administrative zone. Test denied egress to an unapproved destination. Record source zone, destination, port or route, policy identity, time, and result, without recording prompt bodies. Assign platform network ownership for ingress, egress, route separation, name resolution, and certificate configuration. The lab has no network services, so its local JavaScript result cannot prove any of these observations. Docker documents that containers have no resource constraints by default, and the Kubernetes security checklist provides configuration guidance. Neither document is evidence that a deployment applied the control.

Visual alternative: Authorized clients reach authenticated inference, operators use a separate management path, and prohibited management and egress paths are denied.

Sources:

- <https://docs.docker.com/engine/containers/resource_constraints/>
- <https://kubernetes.io/docs/concepts/security/security-checklist/>
- <https://csrc.nist.gov/pubs/sp/800/207/final>

## Narration: Secrets Resources Narration

Keep secrets out of images, repositories, model packages, prompts, logs, traces, command lines, screenshots, and static examples. Deliver each secret through the approved secret mechanism, scope it to one purpose, audit access, rotate it, revoke it, and prove that the replaced identity no longer works. Use synthetic identifiers in teaching material. A lifecycle-state field in a fixture is not a credential and is not proof of cryptographic verification. Minimize and classify request and response data. Redact telemetry, isolate caches, define retention and deletion, and prepare incident handling for disclosure. Resource abuse needs equally explicit controls. Enforce body, context, output, concurrency, rate, queue, compute, memory, and deadline limits before one caller exhausts service for everyone. OWASP API Security identifies unrestricted resource consumption as a critical API risk. Combine gateway admission controls with infrastructure limits. Define whether an over-limit request is rejected, queued, canceled, or degraded, and record a bounded metric. In the lab, the exhaustion case supplies units equal to 9 for invoke, while the synthetic policy limit is 8. Nine is a finite integer and passes structural validation, but policy denies it as resource_limit. By contrast, Infinity is malformed and fails validation before admission. This distinction matters: malformed input is rejected for structure, while a valid but expensive request is rejected for operational policy.

Visual alternative: The worksheet shows 9 greater than 8, so admission denies the request for resource_limit. Infinity fails structural validation. Secrets do not enter prompts, artifacts, or logs.

Sources:

- <https://owasp.github.io/API-Security/editions/2023/en/0x11-t10/>
- <https://docs.docker.com/engine/containers/resource_constraints/>
- <https://kubernetes.io/docs/concepts/security/security-checklist/>

## Learner Prompt: Changed Input Prompt

Changed-input task. Do not replay the first fixture. An active principal named user-blue has the invoker role in tenant-blue. The request asks to invoke endpoint-red, whose resource tenant is tenant-red. The action is invoke, the lifecycle state is active, and the units value is 1. Predict the result before reading the answer. Which comparison controls the result, and why would a patch tied to a particular user or endpoint be inadequate?

Learner action: Predict deny with reason scope_mismatch because tenant-blue differs from tenant-red, despite valid authentication, role, and units.

Sources:

- <https://csrc.nist.gov/pubs/sp/800/207/final>

## Pause: Changed Input Pause

## Feedback: Changed Input Feedback

The changed case is denied with reason scope_mismatch. The comparison is tenant-blue versus tenant-red, and they differ. The action and units are otherwise valid, but a valid role does not grant access to every object. A general comparison works for either tenant direction, so it rejects both user-red toward endpoint-blue and user-blue toward endpoint-red. A patch that names particular fixtures is not the policy. Deny-all is also not a repair. It would reject the valid same-tenant call, fail the requirement that injection remain inert data rather than break valid authorization, and block the approved recovery behavior. A correct repair preserves valid same-tenant authorization while denying cross-tenant objects.

If correct: You applied the tenant comparison to the independent changed case and preserved valid same-tenant behavior.

If retrying: Do not special-case names or deny everything. Compare validated principal and resource scope, then preserve the existing valid path.

Sources:

- <https://csrc.nist.gov/pubs/sp/800/207/final>

## Narration: Test And Revoke Narration

Test denial, revocation, containment, and recovery as observable outcomes. Test missing, expired, wrong-audience, forged, and revoked credentials; cross-role and cross-object access; management access through the serving route; oversized and adversarial inputs; prompt injection; secret leakage; prohibited egress; repeated expensive requests; malformed streams; and telemetry disclosure. For each case, define expected status, absence of unauthorized side effects, bounded cost, redacted audit evidence, and owner. The lifecycle sequence is equally important. An active synthetic principal completes an allowed same-tenant call. An old identity is marked expired during rotation. A replacement becomes active only after approved issuance. The old identity is then revoked, and every later request is denied. In-flight work is identified and reconciled. A separately scoped recovery principal performs only recover on the affected tenant resource. The ordinary least-privilege action is retested, and the emergency route is closed. The local lab demonstrates fixture decisions for active and revoked states and an authorized recovery action. It does not create, expire, rotate, or cryptographically revoke a real credential. Security is incomplete if access can be denied but cannot be safely restored through an approved path.

Visual alternative: Each test records safe denial, no unauthorized side effect, bounded cost, redacted evidence, containment, restoration, and owner.

Sources:

- <https://owasp.github.io/API-Security/editions/2023/en/0x11-t10/>
- <https://kubernetes.io/docs/concepts/security/security-checklist/>
- <https://csrc.nist.gov/pubs/sp/800/207/final>

## Demonstration: Lab Executable Entry

The executable lab entry is local and deterministic. It uses Node.js 22 native ECMAScript modules, local fixtures, no package dependencies, no network, no live model, and no real credentials. From the repository root, run the starter command shown in the selectable artifact. The starter is expected to exit with code 1, write empty standard error, and report eight passes and two failures. The two failures are the symmetric cross-tenant cases. Edit only the authorization implementation. Do not edit validators, fixtures, tests, expected evidence, or resource catalogs. Then run the same command again. The repaired result is expected to exit with code 0, write empty standard error, and report ten passes and zero failures. The independent reference command uses a separate implementation and is an environment check, not proof of production deployment. If you need to restore the intentionally defective starter, use the reset command shown in the artifact. The reset is bounded to the lab directory.

Visual alternative: The card provides starter, reference, and reset commands and identifies which results are local fixture evidence rather than live infrastructure evidence.

Sources:

- <https://csrc.nist.gov/pubs/sp/800/207/final>
- <https://owasp.github.io/API-Security/editions/2023/en/0x11-t10/>

## Learner Prompt: Activity Transition

Open the synthetic endpoint security review. First draw serving and management data flows with principals, credentials, boundaries, data classes, stores, and outbound dependencies. Next create the role matrix for invoke, discover, configure, promote, observe, approve, rotate, revoke, and recover. Add network, secret, data, resource, audit, and break-glass controls with explicit denial, an owner, and observable evidence. Create unauthorized, over-privileged, exhaustion, injection, leakage, revocation, containment, and recovery tests. Include the exact starter and repaired transcripts, standard error, exit codes, learner prediction, source diff, changed-input result, and causal explanation. Label every fixture simulation that does not prove deployed identity, network, secret, runtime, audit, or recovery enforcement. Finish by answering: which control still depends on trusting model output, and how will you move enforcement outside the model?

Learner action: Complete the threat model, least-privilege matrix, control matrix, negative-test and recovery report, exact lab evidence, independent prediction, changed-input answer, causal explanation, and residual-risk labels.

Sources:

- <https://csrc.nist.gov/pubs/sp/800/207/final>
- <https://owasp.github.io/API-Security/editions/2023/en/0x11-t10/>
- <https://docs.docker.com/engine/containers/resource_constraints/>
- <https://kubernetes.io/docs/concepts/security/security-checklist/>

## Pause: Activity Work Time

## Assessment Handoff: Assessment Handoff

When ready, begin the knowledge check. It asks where authorization belongs, why shared long-lived credentials weaken attribution and scoped revocation, what positive and negative network tests prove, where secrets must not appear, which controls bound expensive requests, and what completes a revocation test. Choose Begin knowledge check yourself. Nothing starts or submits automatically.

## Closing: Class Closing

Remember the governing boundary. The model is untrusted data processing inside a larger security system. Verify every principal in the real identity layer. Authorize every object and function outside the prompt. Compare scope, not just role. Bound every route and resource. Keep secrets and sensitive content off unsafe surfaces. Test malformed input, valid changed input, exhaustion, injection, revocation, and recovery. Treat local fixture results as limited evidence, and separately verify deployed identity, network, secret, data, runtime, audit, and emergency controls. Security is a causal chain: an explicit principal leads to an explicit decision, a bounded action, a redacted record, and a recoverable outcome.

Visual alternative: The checklist states: verify principal, compare scope, bound action, protect data, record safely, revoke, reconcile, and recover.

Sources:

- <https://csrc.nist.gov/pubs/sp/800/207/final>
- <https://owasp.github.io/API-Security/editions/2023/en/0x11-t10/>
