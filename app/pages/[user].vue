<script setup lang="ts">
const router = useRoute();

const { data: habits } = useQuery({
  key: ['habits'],
  query: () => useRequestFetch()('/api/habits') as Promise<Habit[]>,
});

const emptyHabits = computed(() => habits.value?.length === 0);
</script>

<template>
  <Card>
    <div class="relative z-10">
      <ProfileHeader />
      <div class="scrollable-card max-h-[calc(100vh-18.875rem)] overflow-y-auto">
        <HabitCard v-for="habit in habits" :key="habit.id" :habit="habit" />
      </div>
      <EmptyHabits v-if="emptyHabits" />
    </div>
  </Card>
</template>
