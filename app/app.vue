<script setup lang="ts">
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
    <div class="flex flex-col rounded-3xl border border-neutral-800 bg-neutral-900">
      <ProfileHeader />
      <HabitCard v-for="habit in habits" :key="habit.id" :habit="habit" />
      <EmptyHabits v-if="emptyHabits" />
    </div>
    <AppFooter />
  </Container>
</template>
