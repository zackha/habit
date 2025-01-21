import { eq, and } from 'drizzle-orm';
import { useValidatedParams, zh } from 'h3-zod';

export default eventHandler(async event => {
  const { id } = await useValidatedParams(event, {
    id: zh.intAsString,
  });

  const { user } = await requireUserSession(event);

  const deletedHabit = await useDB()
    .delete(tables.habits)
    .where(and(eq(tables.habits.id, id), eq(tables.habits.userId, user.id)))
    .returning()
    .get();

  return deletedHabit;
});
