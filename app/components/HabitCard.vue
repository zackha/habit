<template>
  <div class="habit">
    <div>
      <form v-if="editingHabit === habit.id" @submit.prevent="saveHabit()">
        <input v-model="edit.title" placeholder="Title" />
        <textarea v-model="edit.description" placeholder="Description (Markdown supported)"></textarea>
        <button type="submit">Save</button>
        <button type="button" @click="cancelEdit">Cancel</button>
      </form>
      <div v-else>
        <h3>{{ habit.title }}</h3>
        <div v-html="renderMarkdown(habit.description || '')"></div>
      </div>
      <div class="habit-status">
        Today:
        <strong :class="isTodayCompleted(habit) ? 'status-completed' : 'status-pending'">
          {{ isTodayCompleted(habit) ? 'Completed' : 'Pending' }}
        </strong>
      </div>
      <HabitHeatmap :habit="habit" />
      <div>
        <button v-if="editingHabit !== habit.id" @click="editHabit(habit)" class="edit-button">Edit</button>
        <button @click="toggleTodayCompletion(habit)" class="complete-today-button">
          {{ isTodayCompleted(habit) ? 'Undo Today' : 'Complete Today' }}
        </button>
        <button @click="deleteHabit(habit)" class="delete-button">Delete</button>
      </div>
      <div class="completion-rate">Completion Rate: {{ getCompletionRate(habit) }}%</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { marked } from 'marked';
import { isSameDay, parseISO, differenceInDays, format, compareAsc } from 'date-fns';
const queryCache = useQueryCache();

defineProps<{ habit: Habit }>();

const renderMarkdown = (text: string) => {
  return marked(text);
};

const getCompletionRate = (habit: Habit) => Math.round((habit.completeDays.length / habit.targetDays) * 100);

const today = format(new Date(), 'yyyy-MM-dd');

// Delete habit
const { mutate: deleteHabit } = useMutation({
  mutation: (habit: Habit) => $fetch(`/api/habits/${habit.id}`, { method: 'DELETE' }),

  async onSuccess() {
    await queryCache.invalidateQueries({ key: ['habits'] });
  },
});

// Edit habit
const editingHabit = ref<number | null>(null);
const edit = ref<{ title: string; description: string }>({
  title: '',
  description: '',
});

const editHabit = (habit: Habit) => {
  editingHabit.value = habit.id;
  edit.value = { title: habit.title, description: habit.description || '' };
};

const { mutate: saveHabit } = useMutation({
  mutation: () =>
    $fetch(`/api/habits/${editingHabit.value}`, {
      method: 'PATCH',
      body: {
        title: edit.value.title,
        description: edit.value.description,
      },
    }),

  async onSuccess() {
    await queryCache.invalidateQueries({ key: ['habits'] });
    editingHabit.value = null;
  },
});

const cancelEdit = () => {
  editingHabit.value = null;
};

const isTodayCompleted = (habit: Habit) => habit.completeDays.some(day => isSameDay(parseISO(day), new Date()));

const { mutate: toggleTodayCompletion } = useMutation({
  mutation: (habit: Habit) => {
    const isCompletedToday = habit.completeDays.some(day => isSameDay(parseISO(day), new Date()));

    const updatedCompleteDays = isCompletedToday ? habit.completeDays.filter(day => !isSameDay(parseISO(day), new Date())) : [...habit.completeDays, today];

    const updatedTargetDays =
      updatedCompleteDays.length === 40 && habit.targetDays === 40 ? 90 : updatedCompleteDays.length < 40 && habit.targetDays === 90 ? 40 : habit.targetDays;

    return $fetch(`/api/habits/${habit.id}`, {
      method: 'PATCH',
      body: {
        completeDays: updatedCompleteDays,
        targetDays: updatedTargetDays,
      },
    });
  },

  async onSuccess() {
    await queryCache.invalidateQueries({ key: ['habits'] });
  },
});
</script>

<style scoped>
.habit {
  border: 1px solid #ddd;
  padding: 10px;
  border-radius: 8px;
  background-color: #f9f9f9;
  position: relative;
  margin-bottom: 20px;
}

.habit-status {
  margin-bottom: 10px;
}

.status-completed {
  color: green;
}

.status-pending {
  color: red;
}

.complete-today-button {
  margin-top: 10px;
  padding: 8px 12px;
  border: none;
  background-color: #4caf50;
  color: white;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.complete-today-button:hover {
  background-color: #45a049;
}

.delete-button {
  margin-top: 10px;
  padding: 8px 12px;
  border: none;
  background-color: #f44336;
  color: white;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.delete-button:hover {
  background-color: #e53935;
}

.edit-button {
  margin-top: 10px;
  padding: 8px 12px;
  border: none;
  background-color: #2196f3;
  color: white;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.edit-button:hover {
  background-color: #1976d2;
}

.completion-rate {
  margin-top: 10px;
  font-weight: bold;
  font-size: 14px;
}
</style>
