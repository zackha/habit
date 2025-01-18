<script setup lang="ts">
import { format } from 'date-fns';
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

const emptyHabits = computed(() => habits.value?.length === 0);
const today = new Date();
const formattedDate = {
  day: format(today, 'dd'),
  monthAndYear: format(today, "MMM''yy"),
  weekDay: format(today, 'EEEE'),
};
</script>

<template>
  <Container>
    <div class="flex justify-between items-center">
      <div class="flex justify-center items-center gap-3">
        <div class="text-5xl font-semibold">{{ formattedDate.day }}</div>
        <div class="today"></div>
      </div>
      <div class="flex flex-col justify-end items-end">
        <div class="text-sm">{{ formattedDate.monthAndYear }}</div>
        <div class="text-sm">{{ formattedDate.weekDay }}</div>
      </div>
    </div>
    <div class="flex justify-between border p-5 rounded-xl">
      <h1 class="text-2xl">Habit</h1>
      <div class="flex gap-4 items-center">
        <button @click="toggleDark">
          <div class="capitalize underline">{{ colorMode.preference }}</div>
        </button>
        <div>
          <a v-if="!loggedIn" href="/api/auth/github">Sign in</a>
          <a v-else @click="clear()">Sign Out</a>
        </div>
      </div>
    </div>
    <HabitForm v-if="emptyHabits" />
    <HabitCard v-if="loggedIn" v-for="habit in habits" :key="habit.id" :habit="habit" />
    <div>
      <p>Habit v{{ config.public.version }}</p>
      <a href="https://github.com/zackha/habit" target="_blank">Github</a>
    </div>
  </Container>
</template>

<style lang="postcss" scoped>
.today {
  @apply w-4 h-4 rounded-full;
  background: linear-gradient(165deg, #ff0000 0%, #ff8e8e 92%);
  &.completed {
    background: linear-gradient(165deg, #15ff00 0%, #a5ffa1 92%);
  }
}
</style>
