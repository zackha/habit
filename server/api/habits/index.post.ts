import { useValidatedBody, z } from 'h3-zod';

export default eventHandler(async event => {
  const { title, description, isPublic } = await useValidatedBody(event, {
    title: z.string().min(1).max(255),
    isPublic: z.boolean().optional(),
    description: z.string().min(1),
  });
  
  const { user } = await requireUserSession(event);

  const habit = await useDB()
    .insert(tables.habits)
    .values({
      userId: user.id,
      title,
      public: isPublic,
      description,
      createdAt: new Date(),
    })
    .returning()
    .get();

  return habit;
});
