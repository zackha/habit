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
    await queryCache.invalidateQueries({ key: ['habits'] });
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
  <UForm :schema="schema" :state="formState" class="flex flex-col gap-4" @submit="onSubmit">
    <UFormGroup name="title">
      <UInput size="lg" v-model="formState.title" placeholder="Title" />
    </UFormGroup>
    <UFormGroup name="description">
      <UTextarea size="lg" v-model="formState.description" placeholder="Description (Markdown supported)" autoresize :maxrows="3" />
    </UFormGroup>
    <UButton size="lg" type="submit" label="Add Habit" block />
  </UForm>
</template>
