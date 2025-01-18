import { eq, and } from 'drizzle-orm';
import { useValidatedParams, useValidatedBody, z, zh } from 'h3-zod';

export default eventHandler(async event => {
  const { id } = await useValidatedParams(event, {
    id: zh.intAsString,
  });

  const { title, description } = await useValidatedBody(event, {
    title: z.string().min(1).max(255),
    description: z.string().max(1000).optional(),
  });

  const { user } = await requireUserSession(event);

  const habit = await useDB()
    .update(tables.habits)
    .set({ title, description })
    .where(and(eq(tables.habits.id, id), eq(tables.habits.userId, user.id)))
    .returning()
    .get();

  return habit;
});
