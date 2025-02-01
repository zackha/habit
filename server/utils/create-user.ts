export default async (sessionUser: User) => {
    const user = await useDB()
        .insert(tables.user)
        .values({
            id: sessionUser.id,
            createdAt: new Date(),
        })
        .onConflictDoUpdate({
            target: tables.user.id,
            set: { 
                id: sessionUser.id
             },
        })
        .returning()
        .get();

    return user;
};
