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
    <div v-if="user" class="flex flex-col rounded-3xl border border-neutral-800 bg-neutral-900">
      <ProfileHeader />
      <HabitCard v-for="habit in habits" :key="habit.id" :habit="habit" />
      <EmptyHabits v-if="emptyHabits" />
    </div>
    <div v-else class="flex flex-col items-start justify-center gap-7 rounded-3xl border border-neutral-800 bg-neutral-900 p-6">
      <div class="flex w-5/6 flex-col gap-4">
        <div class="h-12 w-12 rounded-2xl border-4 border-black/35 bg-green-400 shadow-lg"></div>
        <div class="text-lg font-medium">Habit Tracker</div>
        <div class="text-3xl font-medium">
          An efficient tool to
          <span class="text-green-400">track</span>
          and manage your
          <span class="text-green-400">daily habits</span>
        </div>
      </div>
      <UButton to="/api/auth/github" icon="i-simple-icons-github" label="Login with GitHub" color="black" />
    </div>
    <AppFooter />
  </Container>
</template>
