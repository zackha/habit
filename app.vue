<template>
  <div class="calendar">
    <!-- Yeni alışkanlık ekleme formu -->
    <HabitForm />
    <!-- Alışkanlık kartları -->
    <div class="habits">
      <HabitCard v-for="habit in habits" :key="habit.id" :habit="habit" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useHabits } from '@/composables/useHabits';
import HabitCard from '@/components/HabitCard.vue';
import HabitForm from '@/components/HabitForm.vue';

const { habits } = useHabits();
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
