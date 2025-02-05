<script setup lang="ts">
import { z } from 'zod';
import type { FormSubmitEvent } from '#ui/types';

const schema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title cannot exceed 100 characters'),
  description: z.string().min(1, 'Description is required').max(1000, 'Description cannot exceed 1000 characters'),
});

type Schema = z.output<typeof schema>;

const formState = reactive<Schema>({
  title: '',
  description: '',
});

const queryCache = useQueryCache();
const emit = defineEmits<{
  (e: 'habitAdded'): void;
}>();

const { mutate: addHabit } = useMutation({
  mutation: (data: Schema) => {
    return $fetch('/api/habits', {
      method: 'POST',
      body: data,
    }) as Promise<Habit>;
  },

  async onSuccess() {
    await queryCache.invalidateQueries({ key: ['my_habits'] });
    emit('habitAdded');
  },

  onSettled() {
    formState.title = '';
    formState.description = '';
  },
});

async function onSubmit(event: FormSubmitEvent<Schema>) {
  addHabit(event.data);
}
</script>

<template>
  <div class="p-8">
    <UForm :schema="schema" :state="formState" class="flex flex-col gap-4" @submit="onSubmit">
      <UFormGroup name="title">
        <div class="input-container">
          <input v-model="formState.title" placeholder="Title..." />
        </div>
      </UFormGroup>
      <UFormGroup name="description">
        <div class="input-container">
          <textarea class="scroll-bar" rows="5" v-model="formState.description" placeholder="Description (Markdown supported)..."></textarea>
        </div>
      </UFormGroup>
      <button type="submit" class="button bg-green-400 px-2.5 py-3 font-semibold text-green-950 outline-none hover:bg-green-300">Add Habit</button>
    </UForm>
  </div>
</template>

<style lang="postcss" scoped>
.input-container {
  @apply relative flex w-full items-center;
}

input,
textarea {
  box-shadow:
    inset 0.5px 0.5px 1px 0px rgba(255, 255, 255, 0.1),
    inset -0.5px -0.5px 1px 0px rgba(0, 0, 0, 0.1),
    rgba(0, 0, 0, 0.2) 0px 3px 10px -5px;
  @apply w-full rounded-2xl bg-white/10 p-4 outline-none transition-all placeholder:text-white/35;
  &:focus {
    @apply bg-white/15;
  }
}
</style>
