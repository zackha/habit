import { eq } from 'drizzle-orm';

export default eventHandler(async event => {
  const { user: requestUser } = await requireUserSession(event);

  const user = await useDB().select().from(tables.users).where(eq(tables.users.id, requestUser.id)).limit(1).get();

  return user;
});
