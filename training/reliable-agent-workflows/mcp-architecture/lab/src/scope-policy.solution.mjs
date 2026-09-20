export function workspaceAllowed(allowedWorkspaces, requestedWorkspace) {
  return allowedWorkspaces.includes(requestedWorkspace);
}
