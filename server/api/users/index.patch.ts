import { eq } from 'drizzle-orm';
import { useValidatedBody, z } from 'h3-zod';

export default eventHandler(async event => {
  const { userView } = await useValidatedBody(event, {
    userView: z.boolean().optional(),
  });

  const { user: requestUser } = await requireUserSession(event);

  const updatedFields: Partial<{ userView: boolean }> = { userView };

  const user = await useDB().update(tables.users).set(updatedFields).where(eq(tables.users.id, requestUser.id)).returning().get();

  return user;
});
