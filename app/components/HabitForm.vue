<script setup lang="ts">
const title = ref('');
const description = ref('');
const queryCache = useQueryCache();

const { mutate: addHabit } = useMutation({
  mutation: (data: { title: string; description: string }) => {
    if (!title.value.trim() || !description.value.trim()) throw new Error('Error: Title and description are required');

    return $fetch('/api/habits', {
      method: 'POST',
      body: data,
    }) as Promise<Habit>;
  },

  async onSuccess() {
    await queryCache.invalidateQueries({ key: ['habits'] });
  },

  onSettled() {
    title.value = '';
    description.value = '';
  },
});
</script>

<template>
  <form class="flex flex-col gap-4" @submit.prevent="addHabit({ title, description })">
    <UInput size="lg" v-model="title" placeholder="Title" />
    <UTextarea size="lg" v-model="description" placeholder="Description (Markdown supported)" autoresize :maxrows="3" />
    <UButton size="lg" type="submit" label="Add Habit" block />
  </form>
</template>
