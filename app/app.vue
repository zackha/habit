<script setup lang="ts">
const { user } = useUserSession();

const { data: habits } = useQuery({
  key: ['habits'],
  query: () => useRequestFetch()('/api/habits') as Promise<Habit[]>,
  enabled: !!useUserSession().loggedIn.value,
});

const emptyHabits = computed(() => habits.value?.length === 0);
</script>

<template>
  <Container>
    <AppHeader />
    <Transition name="fade" mode="out-in">
      <Card v-if="user" class="flex flex-col">
        <ProfileHeader />
        <HabitCard v-for="habit in habits" :key="habit.id" :habit="habit" />
        <EmptyHabits v-if="emptyHabits" />
      </Card>
      <Card v-else class="flex flex-col items-start justify-center gap-7 p-6 backdrop-blur-xl">
        <div class="flex w-5/6 flex-col gap-5">
          <div class="h-12 w-12 rounded-2xl border-4 border-green-400/30 bg-green-400/50 shadow-lg"></div>
          <div class="text-lg font-medium">Habit Tracker</div>
          <div class="text-3xl font-medium">
            An efficient tool to
            <span class="text-green-400">track</span>
            and manage your
            <span class="text-green-400">daily habits</span>
          </div>
        </div>
        <a href="/api/auth/github" class="button">
          <UIcon name="i-simple-icons-github" class="h-5 w-5" />
          Continue with GitHub
        </a>
      </Card>
    </Transition>
    <AppFooter />
  </Container>
</template>

<style lang="postcss" scoped>
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
  @apply flex items-center justify-center gap-2 rounded-full bg-white/10 px-2.5 py-2 text-sm text-white backdrop-blur-sm transition-all;
  &:active {
    @apply scale-95;
  }
  &:hover {
    @apply bg-white/20;
  }
}
</style>
