import { eq, and } from 'drizzle-orm';
import { useValidatedParams, useValidatedBody, z, zh } from 'h3-zod';

export default eventHandler(async event => {
  const { id } = await useValidatedParams(event, {
    id: zh.intAsString,
  });

  const { title, description, completeDays, habitView } = await useValidatedBody(event, {
    title: z.string().optional(),
    description: z.string().optional(),
    completeDays: z.array(z.string()).optional(),
    habitView: z.boolean().optional(),
  });

  const { user } = await requireUserSession(event);

  const updatedFields: Partial<{ title: string; description: string; completeDays: string[]; habitView: boolean }> = {};
  if (title) updatedFields.title = title;
  if (description) updatedFields.description = description;
  if (completeDays) updatedFields.completeDays = completeDays;
  if (habitView !== undefined) updatedFields.habitView = habitView;

  const habit = await useDB()
    .update(tables.habits)
    .set(updatedFields)
    .where(and(eq(tables.habits.id, id), eq(tables.habits.userId, user.id)))
    .returning()
    .get();

  return habit;
});
