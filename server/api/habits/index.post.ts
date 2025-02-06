import { useValidatedBody, z } from 'h3-zod';

export default eventHandler(async event => {
  const { title, description, habitView } = await useValidatedBody(event, {
    title: z.string().min(1, 'Title is required').trim(),
    description: z.string().min(1, 'Description is required').trim(),
    habitView: z.boolean(),
  });

  const { user } = await requireUserSession(event);

  const habit = await useDB()
    .insert(tables.habits)
    .values({
      userId: user.id,
      title,
      description,
      createdAt: new Date(),
      habitView,
    })
    .returning()
    .get();

  return habit;
});
