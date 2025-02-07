import { eq } from 'drizzle-orm';
import { useValidatedParams, z } from 'h3-zod';

export default eventHandler(async event => {
  const { login } = await useValidatedParams(event, {
    login: z.string().toLowerCase(),
  });

  const user = await useDB().select().from(tables.users).where(eq(tables.users.login, login)).limit(1).get();

  return user;
});
