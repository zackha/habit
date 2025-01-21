<script setup lang="ts">
import { marked } from 'marked';
import { isSameDay, parseISO, format } from 'date-fns';
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
    <HabitHeatmap :habit="habit" :habitDays="49" />
  </div>
  <UModal v-model="openHabitModal" :ui="{ background: '', shadow: '', overlay: { base: 'backdrop-blur-2xl', background: 'dark:bg-black/60' } }">
    <div class="flex flex-col gap-4">
      <div class="flex flex-col items-center justify-center gap-2.5 rounded-2xl border border-neutral-800 bg-neutral-400/5 p-2.5 shadow-md shadow-black">
        <div class="flex w-full items-center justify-between gap-2.5 px-0.5 text-neutral-600">
          <div class="text-xs">
            Completion Rate:
            <strong>{{ getCompletionRate(habit) }}%</strong>
          </div>
          <UProgress
            :value="getCompletionRate(habit)"
            size="xs"
            :ui="{
              wrapper: 'flex-1',
              progress: {
                color: 'dark:text-neutral-600',
                track:
                  '[&::-webkit-progress-bar]:bg-neutral-200 [&::-webkit-progress-bar]:dark:bg-neutral-800 [@supports(selector(&::-moz-progress-bar))]:bg-neutral-200 [@supports(selector(&::-moz-progress-bar))]:dark:bg-neutral-800',
              },
            }" />
          <div class="text-xs">
            Today:
            <strong>
              {{ isTodayCompleted(habit) ? 'Completed' : 'Pending' }}
            </strong>
          </div>
        </div>
        <HabitHeatmap :habit="habit" :habitDays="287" />
      </div>
      <div class="flex flex-col gap-4 rounded-2xl">
        <div class="flex justify-between">
          <div class="flex items-center gap-4">
            <!--<UButton icon="i-heroicons-arrow-left-20-solid" size="sm" color="white" :ui="{ rounded: 'rounded-full' }" square @click="openHabitModal = false" />-->
            <div class="text-xl font-semibold">{{ habit.title }}</div>
          </div>
          <div class="flex items-center gap-3">
            <UButton
              :color="isTodayCompleted(habit) ? 'white' : 'primary'"
              :icon="isTodayCompleted(habit) ? '' : 'i-heroicons-check-16-solid'"
              @click="toggleTodayCompletion(habit)"
              :ui="{ rounded: 'rounded-full' }">
              {{ isTodayCompleted(habit) ? 'Undo' : 'Complete' }}
            </UButton>
            <UButton color="white" :ui="{ rounded: 'rounded-full' }" square trailing-icon="i-heroicons-ellipsis-horizontal-20-solid" />
          </div>
        </div>
        <div class="rounded-xl border border-neutral-800 bg-neutral-900 p-3">
          <div class="prose prose-sm dark:prose-invert" v-html="renderMarkdown(habit.description || '')"></div>
        </div>
        <form v-if="editingHabit === habit.id" @submit.prevent="saveHabit()" class="flex flex-col gap-2">
          <UInput v-model="edit.title" :padded="false" variant="none" />
          <UTextarea v-model="edit.description" :padded="false" variant="none" autoresize />
          <button type="submit">Save</button>
          <button type="button" @click="cancelEdit">Cancel</button>
        </form>
        <!--<div>
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
        </div>-->
      </div>
    </div>
  </UModal>
</template>
