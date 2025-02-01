import { eq } from 'drizzle-orm';

export default eventHandler(async event => {
  const { user: requestUser } = await requireUserSession(event);

  const user = await useDB().select().from(tables.user).where(eq(tables.habits.userId, requestUser.id)).limit(1).get();

  return user;
});
