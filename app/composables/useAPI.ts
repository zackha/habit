import type { UseFetchOptions } from 'nuxt/app'

export function useAPI<T>(
  url: string | Request | Ref<string | Request> | (() => string | Request),
  options?: UseFetchOptions<T>,
) {
  return useFetch(url, {
    ...options,
    $fetch: useNuxtApp().$api as typeof $fetch
  })
}