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

<template>
  <div class="habit">
    <HabitHeatmap :habit="habit" />
    <form v-if="editingHabit === habit.id" @submit.prevent="saveHabit()">
      <input v-model="edit.title" placeholder="Title" />
      <textarea v-model="edit.description" placeholder="Description (Markdown supported)"></textarea>
      <button type="submit">Save</button>
      <button type="button" @click="cancelEdit">Cancel</button>
    </form>
    <div v-else>
      <div class="font-medium">{{ habit.title }}</div>
      <div class="text-sm" v-html="renderMarkdown(habit.description || '')"></div>
    </div>
    <div>
      Today:
      <strong :class="isTodayCompleted(habit) ? 'status-completed' : 'status-pending'">
        {{ isTodayCompleted(habit) ? 'Completed' : 'Pending' }}
      </strong>
    </div>
    <div>
      <button v-if="editingHabit !== habit.id" @click="editHabit(habit)" class="edit-button">Edit</button>
      <button @click="toggleTodayCompletion(habit)" class="complete-today-button">
        {{ isTodayCompleted(habit) ? 'Undo Today' : 'Complete Today' }}
      </button>
      <button @click="deleteHabit(habit)" class="delete-button">Delete</button>
    </div>
    <div class="completion-rate">Completion Rate: {{ getCompletionRate(habit) }}%</div>
  </div>
</template>

<style lang="postcss" scoped>
.habit {
  @apply border border-neutral-600 p-4 rounded-2xl gap-4 flex flex-col;
}

.status-completed {
  @apply text-green-500;
}

.status-pending {
  @apply text-red-500;
}

.complete-today-button {
  @apply bg-green-500 text-white px-4 py-2 rounded-md cursor-pointer transition-colors duration-300;
  transition: background-color 0.3s ease;
  &:hover {
    @apply bg-green-800;
  }
}

.delete-button {
  @apply bg-red-500 text-white px-4 py-2 rounded-md cursor-pointer transition-colors duration-300;
  &:hover {
    @apply bg-red-800;
  }
}

.edit-button {
  @apply bg-blue-500 text-white px-4 py-2 rounded-md cursor-pointer transition-colors duration-300;
  &:hover {
    @apply bg-blue-800;
  }
}

.completion-rate {
  @apply font-bold;
}
</style>
