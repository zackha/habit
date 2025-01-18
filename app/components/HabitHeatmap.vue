<script setup lang="ts">
import { format, subDays } from 'date-fns';

interface Day {
  date: string;
}

type Week = Day[];

defineProps<{ habit: Habit }>();

const tooltip = ref<HTMLDivElement | null>(null);

const generateWeeks = (habit: Habit): Week[] => {
  const days: Day[] = Array.from({ length: habit.targetDays }, (_, i) => {
    const date = subDays(new Date(), habit.targetDays - 1 - i);
    return { date: format(date, 'yyyy-MM-dd') };
  });

  return days.reduce<Week[]>((weeks, day, index) => {
    if (index % 7 === 0) weeks.push([]);
    weeks[weeks.length - 1].push(day);
    return weeks;
  }, []);
};

const showTooltip = (date: string, event: MouseEvent): void => {
  if (tooltip.value) {
    tooltip.value.textContent = `Date: ${date}`;
    tooltip.value.style.top = `${event.clientY + 10}px`;
    tooltip.value.style.left = `${event.clientX + 10}px`;
    tooltip.value.style.visibility = 'visible';
  }
};

const hideTooltip = (): void => {
  if (tooltip.value) {
    tooltip.value.style.visibility = 'hidden';
  }
};
</script>

<template>
  <div class="heatmap">
    <div v-for="(week, weekIndex) in generateWeeks(habit)" :key="weekIndex" class="week">
      <div
        v-for="(day, dayIndex) in week"
        :key="dayIndex"
        :class="['day', { active: habit.completeDays.includes(day.date) }]"
        @mouseenter="showTooltip(day.date, $event)"
        @mouseleave="hideTooltip"></div>
    </div>
    <div ref="tooltip" class="tooltip"></div>
  </div>
</template>

<style scoped>
.heatmap {
  display: flex;
  gap: 4px;
  justify-content: center;
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
  border: 0.5px solid rgb(0 0 0 / 20%);
}

.day.active {
  background-color: #2ac430;
  box-shadow: 0 0 4px 0 #2ac430;
}

.tooltip {
  position: fixed;
  background-color: black;
  color: white;
  padding: 5px 8px;
  border-radius: 4px;
  font-size: 12px;
  visibility: hidden;
  pointer-events: none;
  z-index: 1000;
}
</style>
