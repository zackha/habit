export default defineOAuthGitHubEventHandler({
  async onSuccess(event, { user }) {
    await useDB()
      .insert(tables.users)
      .values({
        id: user.id,
        login: user.login.toLowerCase(),
        name: user.name || user.login,
        bio: user.bio || '',
        avatarUrl: user.avatar_url,
        createdAt: new Date(),
      })
      .returning()
      .get();
    await setUserSession(event, { user });
    return sendRedirect(event, `/${user.login}`);
  },
});
