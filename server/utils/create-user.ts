export interface GithubUser {
    id: number
    login: string
    avatar_url?: string
    bio?: string
    name?:string
}
export default async (sessionUser: GithubUser) => {
    const user = await useDB()
        .insert(tables.user)
        .values({
            id: sessionUser.id,
            username: sessionUser.login.toLowerCase(),
            name: sessionUser.name || sessionUser.login,
            bio: sessionUser.bio,
            avatarUrl: sessionUser.avatar_url,
            createdAt: new Date(),
        })
        .onConflictDoUpdate({
            target: tables.user.id,
            set: {
                name: sessionUser.name || sessionUser.login,
                bio: sessionUser.bio,
                avatarUrl: sessionUser.avatar_url,
             },
        })
        .returning()
        .get();

    return user;
};
