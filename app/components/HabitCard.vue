<script setup lang="ts">
import { marked } from 'marked';
import { isSameDay, parseISO, differenceInDays, format, compareAsc } from 'date-fns';
const queryCache = useQueryCache();

defineProps<{ habit: Habit }>();

const renderMarkdown = (text: string) => {
  return marked(text);
};

const getCompletionRate = (habit: Habit) => Math.round((habit.completeDays.length / 49) * 100);

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

    const updatedCompleteDays = isCompletedToday
      ? habit.completeDays.filter(day => !isSameDay(parseISO(day), new Date()))
      : [...habit.completeDays, format(new Date(), 'yyyy-MM-dd')];

    return $fetch(`/api/habits/${habit.id}`, {
      method: 'PATCH',
      body: {
        completeDays: updatedCompleteDays,
      },
    });
  },

  async onSuccess() {
    await queryCache.invalidateQueries({ key: ['habits'] });
  },
});

const openHabitModal = ref(false);
</script>

<template>
  <div class="mx-3 mb-3 flex cursor-pointer flex-row gap-3 rounded-2xl border border-neutral-800 bg-neutral-950 p-3" @click="openHabitModal = true">
    <div class="flex flex-1 flex-col gap-1">
      <div class="text-lg font-medium">{{ habit.title }}</div>
      <div class="line-clamp-3 text-xs text-neutral-400" v-html="renderMarkdown(habit.description || '')"></div>
    </div>
    <HabitHeatmap :habit="habit" />
  </div>
  <UModal v-model="openHabitModal">
    <div class="flex flex-col gap-2 p-4">
      <div class="flex max-h-max flex-col gap-0.5 overflow-auto rounded-md">
        <div v-for="row in 7" :key="row" class="flex w-full gap-0.5">
          <div v-for="col in 30" :key="col" :class="['flex h-2.5 w-2.5 rounded-sm', row === 7 && col === 30 ? 'bg-green-400' : 'bg-neutral-800']"></div>
        </div>
      </div>
      <form v-if="editingHabit === habit.id" @submit.prevent="saveHabit()">
        <input v-model="edit.title" placeholder="Title" />
        <textarea v-model="edit.description" placeholder="Description (Markdown supported)"></textarea>
        <button type="submit">Save</button>
        <button type="button" @click="cancelEdit">Cancel</button>
      </form>
      <div v-else class="flex flex-1 flex-col gap-1">
        <div class="text-lg font-medium">{{ habit.title }}</div>
        <div class="text-xs text-neutral-400" v-html="renderMarkdown(habit.description || '')"></div>
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
  </UModal>
</template>
