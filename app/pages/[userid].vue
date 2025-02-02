<script setup lang="ts">
import { useAPI } from '~/composables/useAPI';

const { loggedIn } = useUserSession();
const router = useRoute();
const { publicUser } = usePublicUser()

useAPI(`/api/user/${router.params.userid}`, {
  onRequest: () => {
    publicUser.value.status = null;
  },
  onResponse: ({ response }) => {
    publicUser.value.info = response._data?.info;
    publicUser.value.habits = response._data?.habits;
  },
  onResponseError: ({ response }) => {
    publicUser.value.status = response.status;
  }
})

const { data: habits } = useQuery({
  key: ['habits'],
  query: () => useRequestFetch()('/api/habits') as Promise<Habit[]>,
  enabled: loggedIn.value && !publicUser.value.info
});

const emptyHabits = computed(() => habits.value?.length === 0);
const hasUserPublicHabits = computed(() => publicUser.value?.habits?.length ?? 0 > 0);
</script>

<template>
  <Card>
    <div class="relative z-10">
      <ProfileHeader />
      <template v-if="loggedIn">
        <div class="scrollable-card max-h-[calc(100vh-18.875rem)] overflow-y-auto" >
          <HabitCard v-for="habit in habits" :key="habit.id" :habit="habit" />
        </div>
        <EmptyHabits v-if="emptyHabits" />
      </template>
      <template v-if="!publicUser.status">
        <div v-if="hasUserPublicHabits" class="scrollable-card max-h-[calc(100vh-18.875rem)] overflow-y-auto">
          <HabitCard v-for="habit in publicUser?.habits" :key="habit.id" :habit="habit" />
        </div>
        <EmptyHabits v-else />
      </template>
    </div>
  </Card>
</template>