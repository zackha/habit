<script setup lang="ts">
import { marked } from 'marked';
import { isSameDay, parseISO, format } from 'date-fns';
const queryCache = useQueryCache();

defineProps<{ habit: Habit }>();

const renderMarkdown = (text: string) => marked(text);

const getCompletionRate = (habit: Habit) => Math.round((habit.completeDays.length / 40) * 100);

const openHabitModal = ref(false);

// Delete habit
const confirmDeleteModal = ref(false);
const confirmationText = ref('');

const openDeleteConfirmation = (habit: Habit) => {
  confirmDeleteModal.value = true;
};

const closeDeleteConfirmation = () => {
  confirmationText.value = '';
  confirmDeleteModal.value = false;
};

const { mutate: deleteHabit } = useMutation({
  mutation: (habit: Habit) => $fetch(`/api/habits/${habit.id}`, { method: 'DELETE' }),

  async onSuccess() {
    await queryCache.invalidateQueries({ key: ['habits'] });
  },
});

// Edit habit
const editingHabit = ref<number | null>(null);
const edit = ref<{ title: string; description: string }>({ title: '', description: '' });

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

  async onSuccess(habit) {
    await queryCache.invalidateQueries({ key: ['habits'] });
    if (habit.completeDays.some(day => isSameDay(parseISO(day), new Date()))) {
      startConfettiAnimation();
    }
  },
});

const items = (habit: Habit) => [
  [{ label: 'Edit', icon: 'i-heroicons-pencil-square-20-solid', click: () => editHabit(habit) }],
  [{ label: 'Delete', labelClass: 'text-red-500', iconClass: 'bg-red-500', icon: 'i-heroicons-trash-20-solid', click: () => openDeleteConfirmation(habit) }],
];
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
      <div class="flex flex-col items-center justify-center gap-2.5 rounded-2xl border border-neutral-400/10 bg-neutral-400/5 p-2.5 shadow-md shadow-black">
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
                  '[&::-webkit-progress-bar]:bg-neutral-200 [&::-webkit-progress-bar]:dark:bg-neutral-400/10 [@supports(selector(&::-moz-progress-bar))]:bg-neutral-200 [@supports(selector(&::-moz-progress-bar))]:dark:bg-neutral-400/10',
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
      <div class="flex flex-col gap-4 px-3">
        <div class="flex items-center justify-between gap-3">
          <UInput v-if="editingHabit === habit.id" :ui="{ wrapper: 'flex-1', rounded: 'rounded-full', size: { sm: 'text-sm font-semibold' } }" v-model="edit.title" />
          <div v-else class="text-xl font-semibold">{{ habit.title }}</div>
          <div class="flex items-center gap-3">
            <UButton
              :color="isTodayCompleted(habit) ? 'white' : 'primary'"
              :icon="isTodayCompleted(habit) ? '' : 'i-heroicons-check-16-solid'"
              @click="toggleTodayCompletion(habit)"
              :ui="{ rounded: 'rounded-full' }">
              {{ isTodayCompleted(habit) ? 'Undo' : 'Complete' }}
            </UButton>
            <UDropdown :items="items(habit)" :popper="{ placement: 'bottom-end', arrow: true }" :ui="{ width: 'w-auto' }">
              <UButton color="white" :ui="{ rounded: 'rounded-full' }" square trailing-icon="i-heroicons-ellipsis-horizontal-20-solid" />
            </UDropdown>
          </div>
        </div>
        <div class="flex flex-col gap-2 rounded-2xl border border-neutral-400/10 bg-neutral-200/5 p-3">
          <div class="text-xs font-medium text-neutral-400">{{ format(habit.createdAt, 'MMM d, yyyy') }}</div>
          <UTextarea v-if="editingHabit === habit.id" v-model="edit.description" autoresize />
          <div v-else class="prose prose-sm dark:prose-invert" v-html="renderMarkdown(habit.description || '')"></div>
        </div>
        <div v-if="editingHabit === habit.id" class="flex items-center justify-between">
          <div></div>
          <div class="flex gap-2">
            <UButton :ui="{ rounded: 'rounded-full' }" @click="cancelEdit" color="white" variant="link">Cancel</UButton>
            <UButton :ui="{ rounded: 'rounded-full' }" @click="saveHabit" trailing>Save changes</UButton>
          </div>
        </div>
      </div>
    </div>
    <UModal v-model="confirmDeleteModal" :ui="{ width: 'w-80', rounded: 'rounded-2xl' }">
      <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">Are you sure?</h3>
            <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1" @click="closeDeleteConfirmation" />
          </div>
        </template>
        <div class="flex flex-col gap-4">
          <p v-if="habit.completeDays.length > 1" class="text-sm text-red-500">
            Warning: This habit has been completed for {{ habit.completeDays.length }} days. Deleting it will remove all progress.
          </p>
          <p class="text-sm text-neutral-400">
            To confirm deletion, please type
            <strong>DELETE</strong>
            in the box below.
          </p>
          <UInput color="red" v-model="confirmationText" placeholder="Type DELETE here..." />
          <UButton block color="red" :disabled="confirmationText.toLowerCase() !== 'delete'" @click="deleteHabit(habit)">I understand, delete this habit</UButton>
        </div>
      </UCard>
    </UModal>
  </UModal>
</template>
