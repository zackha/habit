<script setup lang="ts">
const route = useRoute();

const { data: user } = useQuery({
  key: ['user'],
  query: () => useRequestFetch()(`/api/users/${route.params.user}`) as Promise<User>,
});

const { data: habits } = useQuery({
  key: ['habits'],
  query: () => useRequestFetch()(`/api/users/${route.params.user}/habits`) as Promise<Habit[]>,
});

const emptyHabits = computed(() => habits.value?.length === 0);
</script>

<template>
  <Card v-if="user">
    <div class="relative z-10">
      <ProfileHeader :user="user" />
      <div class="scrollable-card max-h-[calc(100vh-18.875rem)] overflow-y-auto">
        <HabitCard v-for="habit in habits" :key="habit.id" :habit="habit" />
      </div>
      <EmptyHabits v-if="emptyHabits" />
    </div>
  </Card>
  <Card v-else class="items-start justify-center gap-7 p-6">
    <div class="relative z-10 flex w-5/6 flex-col gap-5">
      <div class="text-3xl font-semibold">404</div>
      <p class="font-semibold">Sorry, this page isn't available.</p>
      <p class="text-sm text-white/50">The link you followed may be broken, or the page may have been removed.</p>
    </div>
    <a href="/" class="button bg-white/20 px-2.5 py-2 hover:bg-white/30">
      <UIcon name="i-heroicons-arrow-left-16-solid" class="h-5 w-5" />
      Go back to Habit
    </a>
  </Card>
</template>
