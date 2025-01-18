<script setup lang="ts">
const { loggedIn, clear } = useUserSession();
const config = useRuntimeConfig();
const colorMode = useColorMode();

const toggleDark = () => {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark';
};

const { data: habits } = useQuery({
  key: ['habits'],
  query: () => useRequestFetch()('/api/habits') as Promise<Habit[]>,
  enabled: !!loggedIn.value,
});
</script>

<template>
  <Container>
    <div class="flex justify-between border p-5 rounded-xl">
      <h1 class="text-2xl">Habit</h1>
      <div class="flex gap-4 items-center">
        <button @click="toggleDark">
          <div class="capitalize underline">{{ colorMode.preference }}</div>
        </button>
        <div>
          <a v-if="!loggedIn" href="/api/auth/github">Sign in with Github</a>
          <a v-else @click="clear()">Sign Out</a>
        </div>
      </div>
    </div>
    <div class="calendar">
      <HabitForm />
      <div class="habits" v-if="loggedIn">
        <HabitCard v-for="habit in habits" :key="habit.id" :habit="habit" />
      </div>
    </div>
    <div>
      <p>Habit v{{ config.public.version }}</p>
      <a href="https://github.com/zackha/habit" target="_blank">Github</a>
    </div>
  </Container>
</template>

<style scoped>
.calendar {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: Arial, sans-serif;
}

.habits {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
</style>
