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
      .onConflictDoUpdate({
        target: tables.users.id,
        set: {
          name: user.name || user.login,
          bio: user.bio || '',
          avatarUrl: user.avatar_url,
        },
      })
      .returning()
      .get();
    await setUserSession(event, { user });
    return sendRedirect(event, `/${user.login}`);
  },
});
