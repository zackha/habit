//https://nuxt.com/docs/guide/recipes/custom-usefetch#custom-fetch
export default defineNuxtPlugin((nuxtApp) => {
  const api = $fetch.create({
    async onResponseError({ response }) {
      if (response.status === 401) {
        await nuxtApp.runWithContext(() => navigateTo('/'))
      }
    }
  })

  // Expose to useNuxtApp().$api
  return {
    provide: {
      api
    }
  }
})