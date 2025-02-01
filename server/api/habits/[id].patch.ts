import { eq, and } from 'drizzle-orm';
import { useValidatedParams, useValidatedBody, z, zh } from 'h3-zod';

export default eventHandler(async event => {
  const { id } = await useValidatedParams(event, {
    id: zh.intAsString,
  });

  const { title, description, isPublic, completeDays } = await useValidatedBody(event, {
    title: z.string().min(1).optional(),
    description: z.string().optional(),
    isPublic: z.boolean().optional(),
    completeDays: z.array(z.string()).optional(),
  });

  const { user } = await requireUserSession(event);

  const updatedFields: Partial<{ title: string; description: string; public: boolean; completeDays: string[] }> = {};
  if (title) updatedFields.title = title;
  if (description) updatedFields.description = description;
  if (isPublic) updatedFields.public = isPublic;
  if (completeDays) updatedFields.completeDays = completeDays;

  const habit = await useDB()
    .update(tables.habits)
    .set(updatedFields)
    .where(and(eq(tables.habits.id, id), eq(tables.habits.userId, user.id)))
    .returning()
    .get();

  return habit;
});
