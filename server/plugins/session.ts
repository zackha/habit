// server/plugins/session.ts
import { useDB } from '../../server/utils/db'

export default defineNitroPlugin(() => {
    // Called when the session is fetched during SSR for the Vue composable (/api/_auth/session)
    // Or when we call useUserSession().fetch()
    sessionHooks.hook('fetch', async (session, event) => {
        if (session.user) {
            const user = await useDB().select().from(tables.user).where(eq(tables.user.id, session.user.id)).limit(1).get();
            session.user.habitUser = user
            return
        }

        throw createError({statusCode: 401})
        // extend User Session by calling your database
        // or
        // throw createError({ ... }) if session is invalid for example
    })

    // Called when we call useUserSession().clear() or clearUserSession(event)
    sessionHooks.hook('clear', async (session, event) => {
        // Log that user logged out
    })
})
