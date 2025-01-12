<template>
  <div class="habit">
    <h2>{{ habit.name }}</h2>
    <button @click="deleteHabit" class="delete-button">Delete</button>
    <div class="calendar">
      <div class="heatmap">
        <div v-for="(week, weekIndex) in habit.weeks" :key="weekIndex" class="week">
          <div
            v-for="(day, dayIndex) in week"
            :key="dayIndex"
            :class="['day', { active: day.active }]"
            @click="toggleDay(weekIndex, dayIndex)"
            @mouseenter="updateTooltip(day.date, $event, true)"
            @mouseleave="updateTooltip('', $event, false)"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
interface Day {
  date: string;
  active: boolean;
}

type Week = Day[];

interface Habit {
  id: number;
  name: string;
  weeks: Week[];
}

const props = defineProps<{ habit: Habit }>();
const emit = defineEmits(['delete', 'toggle-day', 'update-tooltip']);

const deleteHabit = () => emit('delete', props.habit.id);
const toggleDay = (weekIndex: number, dayIndex: number) => emit('toggle-day', props.habit.id, weekIndex, dayIndex);
const updateTooltip = (date: string, event: MouseEvent, visible: boolean) => emit('update-tooltip', date, event, visible);
</script>

<style scoped>
.habit {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.calendar {
  margin-top: 10px;
}

.heatmap {
  display: flex;
  flex-direction: row;
  gap: 4px;
}

.week {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.day {
  width: 12px;
  height: 12px;
  background-color: #e0e0e0;
  border-radius: 2px;
  transition: background-color 0.3s ease-in-out;
  cursor: pointer;
}

.day.active {
  background-color: #4caf50;
}

.day:hover {
  opacity: 0.8;
}

.delete-button {
  margin: 10px 0;
  padding: 5px 10px;
  font-size: 14px;
  border: none;
  background-color: #f44336;
  color: white;
  border-radius: 4px;
  cursor: pointer;
}

.delete-button:hover {
  background-color: #d32f2f;
}
</style>
