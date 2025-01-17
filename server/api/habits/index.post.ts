import { useValidatedBody, z } from 'h3-zod';

const HabitSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().min(1),
});

export default eventHandler(async event => {
  const { title, description } = await useValidatedBody(event, HabitSchema);

  const { user } = await requireUserSession(event);

  const habit = await useDB()
    .insert(tables.habits)
    .values({
      userId: user.id,
      title,
      description,
      createdAt: new Date(),
    })
    .returning()
    .get();

  return habit;
});
