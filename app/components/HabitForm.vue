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
  <form class="new-habit-form" @submit.prevent="addHabit({ title, description })">
    <input v-model="title" placeholder="Title" />
    <textarea v-model="description" placeholder="Description"></textarea>
    <button type="submit">Add Habit</button>
  </form>
</template>

<style scoped>
.new-habit-form {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
}

.new-habit-form input,
.new-habit-form textarea {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.new-habit-form button {
  padding: 8px 12px;
  border: none;
  background-color: #4caf50;
  color: white;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.new-habit-form button:hover {
  background-color: #45a049;
}
</style>
