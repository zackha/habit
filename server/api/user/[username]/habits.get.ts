import { eq } from 'drizzle-orm';
import { useValidatedParams, z } from 'h3-zod';

export default eventHandler(async (event) =>  {
  const { username } = await useValidatedParams(event, {
    username: z.string()
  });


  const user = await useDB()
    .select()
    .from(tables.user)
    .where(and(eq(tables.user.username, username), eq(tables.user.public, true)))
    .get();

  if (!user) {
    return createError({ statusCode: 404 })
  }

  const habits = await useDB()
    .select()
    .from(tables.habits)
    .where(and(eq(tables.habits.userId, user.id),eq(tables.habits.public, true)))
    .all();

  return habits as Habit[];
});

