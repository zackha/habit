import { eq } from 'drizzle-orm';
import { useValidatedBody, z } from 'h3-zod';

export default eventHandler(async event => {
  const { userView } = await useValidatedBody(event, {
    userView: z.boolean().optional(),
  });

  const { user } = await requireUserSession(event);

  const updatedFields = { userView };

  const updatedUser = await useDB().update(tables.users).set(updatedFields).where(eq(tables.users.id, user.id)).returning().get();

  return updatedUser;
});
