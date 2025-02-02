import { eq } from 'drizzle-orm';
import { useValidatedParams, useValidatedBody, z, zh } from 'h3-zod';

export default eventHandler(async event => {
  const { user } = await requireUserSession(event);

  const { isPublic } = await useValidatedBody(event, {
    isPublic: z.boolean().optional(),
  });

  const updatedFields: Partial<{ isPublic: boolean }> = {};
  if (isPublic !== undefined) updatedFields.isPublic = isPublic;

  const updatedUser = await useDB()
    .update(tables.users)
    .set(updatedFields)
    .where(eq(tables.users.id, user.id))
    .returning()
    .get();

  user.is_public = updatedUser.isPublic;
  await replaceUserSession(event, { user });

  return updatedUser;
});
