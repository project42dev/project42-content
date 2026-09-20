// Fixed intentional baseline fixture. This file is not editable by the learner.
// It deliberately retains the vulnerable prefix comparison so the regression
// test remains independent of src/scope-policy.broken.mjs.
export function workspaceAllowed(allowedWorkspaces, requestedWorkspace) {
  return allowedWorkspaces.some((allowed) => requestedWorkspace.startsWith(allowed));
}
