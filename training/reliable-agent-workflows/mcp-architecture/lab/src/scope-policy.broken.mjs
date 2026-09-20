export function workspaceAllowed(allowedWorkspaces, requestedWorkspace) {
  return allowedWorkspaces.some((allowed) => requestedWorkspace.startsWith(allowed));
}
