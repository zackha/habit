<template>
  <div class="calendar">
    <h1>Activity Heatmap</h1>
    <div class="heatmap">
      <div v-for="(week, weekIndex) in weeks" :key="weekIndex" class="week">
        <div
          v-for="(day, dayIndex) in week"
          :key="dayIndex"
          :class="['day', { active: day.active }]"
          @click="toggleDay(weekIndex, dayIndex)"
          @mouseenter="showTooltip(day.date, $event)"
          @mouseleave="hideTooltip"></div>
      </div>
    </div>
    <div ref="tooltip" class="tooltip"></div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

interface Day {
  date: string;
  active: boolean;
}

type Week = Day[];

// Son 365 günü haftalara bölerek oluştur
const generateWeeks = (): Week[] => {
  const days: Day[] = Array.from({ length: 365 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (364 - i));
    return { date: date.toISOString().split('T')[0], active: false };
  });

  return days.reduce<Week[]>((weeks, day, index) => {
    if (index % 7 === 0) weeks.push([]);
    weeks[weeks.length - 1].push(day);
    return weeks;
  }, []);
};

const weeks = ref<Week[]>(generateWeeks());
const tooltip = ref<HTMLDivElement | null>(null);

const toggleDay = (weekIndex: number, dayIndex: number): void => {
  weeks.value[weekIndex][dayIndex].active = !weeks.value[weekIndex][dayIndex].active;
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
  if (tooltip.value) tooltip.value.style.visibility = 'hidden';
};
</script>

<style scoped>
.calendar {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
  font-family: Arial, sans-serif;
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
