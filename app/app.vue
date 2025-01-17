<template>
  <div>
    <a v-if="!loggedIn" href="/api/auth/github">Sign in with Github</a>
    <a v-else @click="clear()">Sign Out</a>
  </div>
  <div class="calendar">
    <HabitForm />
    <div class="habits" v-if="user">
      <!-- <HabitCard v-for="habit in habits" :key="habit.id" :habit="habit" /> -->
      <pre>{{ habits }}</pre>
    </div>
  </div>
</template>

<script setup lang="ts">
const { loggedIn, user, clear } = useUserSession();

const { data: habits } = useQuery({
  key: ['habits'],
  query: () => useRequestFetch()('/api/habits') as Promise<Habit[]>,
});
</script>

<style scoped>
.calendar {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
  font-family: Arial, sans-serif;
}

.habits {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 20px;
}
</style>
