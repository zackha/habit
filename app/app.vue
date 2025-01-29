<script setup lang="ts">
const { user } = useUserSession();

const { data: habits } = useQuery({
  key: ['habits'],
  query: () => useRequestFetch()('/api/habits') as Promise<Habit[]>,
  enabled: !!useUserSession().loggedIn.value,
});

const emptyHabits = computed(() => habits.value?.length === 0);

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
  ogUrl: 'https://habit.vercel.app',
  ogSiteName: 'Habit',
  twitterCreator: '@ZHatlen',
  twitterSite: '@ZHatlen',
  robots: 'index, follow',
  keywords: 'habit, tracker, daily, habits, management, tool, minimalistic',
});
</script>

<template>
  <Container>
    <Transition name="fade" mode="out-in">
      <Card v-if="user">
        <div class="relative z-10">
          <ProfileHeader />
          <div class="scrollable-card max-h-[calc(100vh-18.875rem)] overflow-y-auto">
            <HabitCard v-for="habit in habits" :key="habit.id" :habit="habit" />
          </div>
          <EmptyHabits v-if="emptyHabits" />
        </div>
      </Card>
      <Card v-else class="items-start justify-center gap-7 p-6">
        <div class="relative z-10 flex w-5/6 flex-col gap-5">
          <div class="h-12 w-12 rounded-2xl border-4 border-green-600 bg-green-400 shadow-lg"></div>
          <div class="text-lg font-medium">Habit Tracker</div>
          <div class="text-3xl font-medium">
            An efficient tool to
            <span class="text-green-400">track</span>
            and manage your
            <span class="text-green-400">daily habits</span>
          </div>
        </div>
        <a href="/api/auth/github" class="button bg-white/20 px-2.5 py-2 hover:bg-white/30">
          <UIcon name="i-simple-icons-github" class="h-5 w-5" />
          Continue with GitHub
        </a>
      </Card>
    </Transition>
    <AppFooter />
  </Container>
</template>

<style lang="postcss">
.scrollable-card {
  scrollbar-width: none;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 250ms;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.button {
  box-shadow:
    inset 0.5px 0.5px 1px 0px rgba(255, 255, 255, 0.1),
    inset -0.5px -0.5px 1px 0px rgba(0, 0, 0, 0.1),
    rgba(0, 0, 0, 0.2) 0px 3px 10px -5px;
  @apply flex items-center justify-center gap-2 rounded-full text-sm backdrop-blur-sm transition-all;
  &:active {
    @apply scale-95;
  }
}
</style>
