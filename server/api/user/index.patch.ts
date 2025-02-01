import { eq, and } from 'drizzle-orm';
import { useValidatedBody, z } from 'h3-zod';

export default eventHandler(async event => {
  const { user: requestUser } = await requireUserSession(event);

  if (requestUser.id) {
    return createError({ statusCode: 401 });
  }

  const { isPublic } = await useValidatedBody(event, {
    isPublic: z.boolean().optional(),
  });

  const updatedFields: Partial<{ public: boolean }> = {};
  if (isPublic) updatedFields.public = isPublic;

  const user = await useDB()
    .update(tables.user)
    .set(updatedFields)
    .where(and(eq(tables.user.id, requestUser.id), eq(tables.user.id, requestUser.id)))
    .returning()
    .get();

  return user;
});
