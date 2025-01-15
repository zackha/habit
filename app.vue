<template>
  <div>
    <button v-if="!session" @click="auth.signInWithOAuth({ provider: 'github' })">Sign in with Github</button>
    <button v-else @click="auth.signOut()">Sign Out</button>
  </div>
  <div class="calendar">
    <HabitForm />
    <div class="habits" v-if="session">
      <HabitCard v-for="habit in habits" :key="habit.id" :habit="habit" />
    </div>
  </div>
</template>

<script setup lang="ts">
const { habits, fetchHabits } = useHabits();
const { auth } = useSupabaseClient();
const session = useSupabaseSession();

onMounted(fetchHabits);
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
