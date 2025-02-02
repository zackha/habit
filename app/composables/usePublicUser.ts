import type { PublicUser } from '~~/types/publicUser';

export const usePublicUser = () => {
  const publicUser = useState<PublicUser>('publicUser', () => {
    return {
      info: null,
      habits: null,
      status: null,
    }
  })

  return {
    publicUser,
  }
}