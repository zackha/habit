export default defineOAuthGitHubEventHandler({
  async onSuccess(event, { user }) {
    const habitUser = await createUser(user);
    await setUserSession(event, { user, habitUser });
    return sendRedirect(event, '/');
  },
});
