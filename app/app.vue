<template>
  <div style="text-align: center">
    <div>
      <a v-if="!loggedIn" href="/api/auth/github">Sign in with Github</a>
      <a v-else @click="clear()">Sign Out</a>
    </div>
    <div class="calendar">
      <HabitForm />
      <div class="habits" v-if="loggedIn">
        <HabitCard v-for="habit in habits" :key="habit.id" :habit="habit" />
        <!-- <pre>{{ habits }}</pre> -->
      </div>
    </div>
    <p>Habit v{{ config.public.version }}</p>
    <a href="https://github.com/zackha/habit" target="_blank">Github</a>
  </div>
</template>

<script setup lang="ts">
const { loggedIn, clear } = useUserSession();
const config = useRuntimeConfig();

const { data: habits } = useQuery({
  key: ['habits'],
  query: () => useRequestFetch()('/api/habits') as Promise<Habit[]>,
  enabled: !!loggedIn.value,
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
