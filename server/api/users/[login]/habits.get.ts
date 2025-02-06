import { eq } from 'drizzle-orm';
import { useValidatedParams, z } from 'h3-zod';

export default eventHandler(async event => {
  const { login } = await useValidatedParams(event, {
    login: z.string().toLowerCase(),
  });

  const user = await useDB().select().from(tables.users).where(eq(tables.users.login, login)).get();

  if (!user || !user.userView) {
    return [] as Habit[];
  }

  const habits = await useDB()
    .select()
    .from(tables.habits)
    .where(and(eq(tables.habits.userId, user.id), eq(tables.habits.habitView, true)))
    .all();

  return habits as Habit[];
});
