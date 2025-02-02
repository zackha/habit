import { eq } from 'drizzle-orm';
import { randomUUID } from 'crypto';

export default defineOAuthGitHubEventHandler({
  async onSuccess(event, { user }) {
    const existingUser = await useDB()
      .select()
      .from(tables.users)
      .where(eq(tables.users.id, user.id))
      .get();

    if (!existingUser) {
      const uuid = randomUUID().toString();
      await useDB()
        .insert(tables.users)
        .values({
          id: user.id,
          publicId: uuid,
          name: user.name,
          bio: user.bio,
          avatarUrl: user.avatar_url,
          createdAt: new Date(),
        });
      user.public_id = uuid;
      user.is_public = false;

      await setUserSession(event, { user });
      return sendRedirect(event, `/${uuid}`);
    } else {
      user.public_id = existingUser.publicId;
      user.is_public = existingUser.isPublic;

      await setUserSession(event, { user });
      return sendRedirect(event, `/${existingUser.publicId}`);
    }
  },
});
