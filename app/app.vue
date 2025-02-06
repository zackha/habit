<script setup lang="ts">
useHead({
  htmlAttrs: { lang: 'en' },
  link: [
    { rel: 'icon', href: '/icon.png' },
    { rel: 'apple-touch-icon', href: '/icon.png' },
    { rel: 'msapplication-TileImage', href: '/icon.png' },
  ],
});

useSeoMeta({
  title: 'Habit',
  description: 'A minimalistic habit tracker application to track and manage your daily habits with ease',
  ogTitle: 'Habit',
  ogDescription: 'A minimalistic habit tracker application to track and manage your daily habits with ease',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
  twitterCard: 'summary_large_image',
  ogImage: '/social-card.png',
  twitterImage: '/social-card.png',
  ogType: 'website',
  ogUrl: 'https://habit.nuxt.dev',
  ogSiteName: 'Habit',
  twitterCreator: '@ZHatlen',
  twitterSite: '@ZHatlen',
  robots: 'index, follow',
  keywords: 'habit, tracker, daily, habits, management, tool, minimalistic',
});
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
