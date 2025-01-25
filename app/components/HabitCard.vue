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
  <ContentBox class="mx-4 mb-4 flex cursor-pointer gap-3 rounded-3xl bg-white/5 p-3 transition hover:bg-white/10" @click="openHabitModal = true">
    <div class="flex flex-1 flex-col justify-center gap-1">
      <div class="text-md font-medium text-white/80">{{ habit.title }}</div>
      <div class="line-clamp-3 text-xs text-white/50" v-html="renderMarkdown(habit.description || '')"></div>
    </div>
    <HabitHeatmap :habit="habit" :habitDays="49" />
  </ContentBox>
  <UModal v-model="openHabitModal" :ui="{ background: '', shadow: '', overlay: { base: 'backdrop-blur-2xl', background: 'dark:bg-black/60' } }">
    <div class="flex flex-col gap-4">
      <ContentBox class="flex flex-col items-center justify-center gap-2.5 rounded-3xl bg-neutral-400/5 p-2.5 backdrop-blur-2xl">
        <div class="flex w-full items-center justify-between gap-2.5 px-0.5 text-white/15">
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
                color: 'dark:text-white/15',
                track:
                  '[&::-webkit-progress-bar]:bg-neutral-200 [&::-webkit-progress-bar]:dark:bg-white/5 [@supports(selector(&::-moz-progress-bar))]:bg-neutral-200 [@supports(selector(&::-moz-progress-bar))]:dark:bg-white/5',
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
      </ContentBox>
      <div class="flex flex-col gap-4 px-3">
        <div class="flex items-center justify-between gap-3">
          <UInput v-if="editingHabit === habit.id" :ui="{ wrapper: 'flex-1', rounded: 'rounded-full', size: { sm: 'text-sm font-semibold' } }" v-model="edit.title" />
          <div v-else class="text-xl font-semibold">{{ habit.title }}</div>
          <div class="flex items-center gap-3">
            <button
              @click="toggleTodayCompletion(habit)"
              class="button px-2.5 py-1.5 font-semibold outline-none"
              :class="isTodayCompleted(habit) ? 'bg-white/10 hover:bg-white/25' : 'bg-green-400 text-green-950 hover:bg-white/25 hover:text-white'">
              <UIcon v-if="!isTodayCompleted(habit)" name="i-heroicons-check-16-solid" class="h-5 w-5" />
              {{ isTodayCompleted(habit) ? 'Undo' : 'Complete' }}
            </button>

            <UDropdown :items="items(habit)" :popper="{ placement: 'bottom-end', arrow: true }" :ui="{ width: 'w-auto' }">
              <button class="button bg-white/10 p-1.5 hover:bg-white/25">
                <UIcon name="i-heroicons-ellipsis-horizontal-20-solid" class="h-5 w-5" />
              </button>
            </UDropdown>
          </div>
        </div>
        <ContentBox class="flex flex-col gap-2 rounded-3xl bg-neutral-200/5 p-4 backdrop-blur-xl">
          <div class="text-xs font-medium text-neutral-400">{{ format(habit.createdAt, 'MMM d, yyyy') }}</div>
          <UTextarea v-if="editingHabit === habit.id" v-model="edit.description" autoresize />
          <div v-else class="prose prose-sm dark:prose-invert" v-html="renderMarkdown(habit.description || '')"></div>
        </ContentBox>
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
