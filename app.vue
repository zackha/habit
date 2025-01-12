<template>
  <div class="app">
    <header>
      <h1>habits</h1>
      <p>Track your habits every day</p>
    </header>

    <section class="habit-list">
      <div v-for="habit in habits" :key="habit.id" class="habit">
        <div class="habit-header">
          <h2>{{ habit.name }}</h2>
          <div class="actions">
            <span class="streak">{{ habit.streak }} DAY STREAK</span>
            <button class="delete-button" @click="deleteHabit(habit.id)">Delete</button>
          </div>
        </div>
        <div class="calendar">
          <div v-for="day in daysOfYear" :key="day" :class="{ active: habit.days[day] }" @click="toggleDay(habit.id, day)"></div>
        </div>
      </div>
    </section>

    <button class="create-button" @click="openCreateModal">+ Create</button>
  </div>
</template>

<script setup lang="ts">
import { format, startOfYear, addDays } from 'date-fns';

const { habits, fetchHabits, createHabit, toggleHabitDay, deleteHabit } = useHabitStore();

onMounted(() => {
  fetchHabits();
});

const daysOfYear = Array.from({ length: 365 }, (_, i) => format(addDays(startOfYear(new Date()), i), 'yyyy-MM-dd'));

const openCreateModal = () => {
  const name = prompt('Enter a habit name:');
  if (name) createHabit(name);
};

const toggleDay = (habitId: string, day: string) => {
  toggleHabitDay(habitId, day);
};
</script>

<style>
body {
  margin: 0;
  font-family: Arial, sans-serif;
  background-color: #1e1e1e;
  color: white;
}

.app {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

header {
  text-align: center;
}

.habit-list {
  margin-top: 30px;
}

.habit {
  margin-bottom: 30px;
}

.habit-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.streak {
  background-color: #4caf50;
  padding: 5px 10px;
  border-radius: 5px;
  font-size: 0.9rem;
}

.delete-button {
  background-color: #e53935;
  color: white;
  padding: 5px 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.delete-button:hover {
  background-color: #d32f2f;
}

.calendar {
  display: grid;
  grid-template-columns: repeat(31, 1fr);
  gap: 2px;
}

.calendar div {
  width: 15px;
  height: 15px;
  background-color: #333;
  cursor: pointer;
}

.calendar div.active {
  background-color: #4caf50;
}

.create-button {
  display: block;
  margin: 20px auto;
  background-color: #444;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
}

.create-button:hover {
  background-color: #555;
}
</style>
