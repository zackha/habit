import { eq, and } from 'drizzle-orm';
import { useValidatedParams, z } from 'h3-zod';

export default eventHandler(async event => {
  const { id } = await useValidatedParams(event, {
    id: z.string(),
  });

  const { user } = await getUserSession(event);

  if (!user || user.public_id !== id) {
    const dbUser = await useDB()
      .select()
      .from(tables.users)
      .where(eq(tables.users.publicId, id))
      .get()

    if (!dbUser) {
      throw createError({
        statusCode: 404,
        message: 'User not found',
      })
    }

    if(!dbUser.isPublic){
      throw createError({
        statusCode: 403,
        message: 'User is private',
      })
    }

    const habits = await useDB()
      .select()
      .from(tables.habits)
      .where(and(eq(tables.habits.userId, dbUser.id), eq(tables.habits.isPublic, true)))
      .all()

    return {
      info: dbUser,
      habits,
    }
  }
});