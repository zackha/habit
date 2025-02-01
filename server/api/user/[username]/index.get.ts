import { eq } from 'drizzle-orm';
import { useValidatedParams, z } from 'h3-zod';

export default eventHandler(async (event) =>  {
  const { username } = await useValidatedParams(event, {
    username: z.string().toLowerCase()
  });
  
  const user = await useDB()
    .select()
    .from(tables.user)
    .where(and(eq(tables.user.username, username),eq(tables.user.public, true)))
    .get();

  return user as User;
});

