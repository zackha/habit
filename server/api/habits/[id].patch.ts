import { eq, and } from 'drizzle-orm';
import { useValidatedParams, useValidatedBody, z, zh } from 'h3-zod';

export default eventHandler(async event => {
  const { id } = await useValidatedParams(event, {
    id: zh.intAsString,
  });

  const { title, description, completeDays, targetDays } = await useValidatedBody(event, {
    title: z.string().min(1).max(255).optional(),
    description: z.string().max(1000).optional(),
    completeDays: z.array(z.string()).optional(),
    targetDays: z.number().int().positive().optional(),
  });

  const { user } = await requireUserSession(event);

  const updatedFields: Partial<{ title: string; description: string; completeDays: string[]; targetDays: number }> = {};
  if (title) updatedFields.title = title;
  if (description) updatedFields.description = description;
  if (completeDays) updatedFields.completeDays = completeDays;
  if (targetDays) updatedFields.targetDays = targetDays;

  const habit = await useDB()
    .update(tables.habits)
    .set(updatedFields)
    .where(and(eq(tables.habits.id, id), eq(tables.habits.userId, user.id)))
    .returning()
    .get();

  return habit;
});
