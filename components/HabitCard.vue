<template>
  <div class="habit">
    <div>
      <!-- Düzenleme Alanı -->
      <div v-if="editingHabit === habit.id">
        <input v-model="editBuffer.title" placeholder="Title" />
        <textarea v-model="editBuffer.description" placeholder="Description (Markdown supported)"></textarea>
        <button @click="saveEdit(habit.id)">Save</button>
        <button @click="cancelEdit">Cancel</button>
      </div>
      <!-- Görüntüleme Alanı -->
      <div v-else>
        <h3>{{ habit.title }}</h3>
        <div v-html="renderMarkdown(habit.description)"></div>
      </div>

      <!-- Bugünün Durumu -->
      <div class="habit-status">
        Today:
        <strong :class="isTodayCompleted(habit) ? 'status-completed' : 'status-pending'">
          {{ isTodayCompleted(habit) ? 'Completed' : 'Pending' }}
        </strong>
      </div>

      <!-- Isı Haritası -->
      <HabitHeatmap :habit="habit" />

      <!-- İşlev Butonları -->
      <div>
        <button v-if="editingHabit !== habit.id" @click="editHabit(habit)" class="edit-button">Edit</button>
        <button @click="toggleTodayCompletion(habit)" class="complete-today-button">
          {{ isTodayCompleted(habit) ? 'Undo Today' : 'Complete Today' }}
        </button>
        <button @click="deleteHabit(habit.id)" class="delete-button">Delete</button>
      </div>

      <!-- Tamamlanma Oranı -->
      <div class="completion-rate">Completion Rate: {{ getCompletionRate(habit) }}%</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { marked } from 'marked';
const { habits, toggleTodayCompletion, isTodayCompleted, getCompletionRate, deleteHabit } = useHabits();

defineProps<{ habit: Habit }>();

const renderMarkdown = (text: string): string => {
  return marked(text);
};

const editingHabit = ref<number | null>(null);
const editBuffer = ref<{ title: string; description: string }>({
  title: '',
  description: '',
});

const editHabit = (habit: Habit): void => {
  editingHabit.value = habit.id;
  editBuffer.value = { title: habit.title, description: habit.description };
};

const saveEdit = (id: number): void => {
  const habit = habits.value.find(h => h.id === id);
  if (habit) {
    habit.title = editBuffer.value.title;
    habit.description = editBuffer.value.description;
  }
  editingHabit.value = null;
};

const cancelEdit = (): void => {
  editingHabit.value = null;
};
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
