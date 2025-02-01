import { eq } from 'drizzle-orm';
import { useValidatedParams, zh } from 'h3-zod';

export default eventHandler(async (event) =>  {
  const { id } = await useValidatedParams(event, {
    id: zh.intAsString,
  });

  const user = await useDB()
    .select()
    .from(tables.user)
    .where(and(eq(tables.user.id, id), eq(tables.user.public, true)))
    .get();

  if (!user) {
    return createError({ statusCode: 404 })
  }

  const habits = await useDB()
    .select()
    .from(tables.habits)
    .where(and(eq(tables.habits.userId, id),eq(tables.habits.public, true)))
    .all();

  return habits as Habit[];
});

