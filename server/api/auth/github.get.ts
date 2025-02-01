export default defineOAuthGitHubEventHandler({
  async onSuccess(event, { user }) {
    await setUserSession(event, { user });
    await createUser(user);
    return sendRedirect(event, '/');
  },
});
