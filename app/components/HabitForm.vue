<template>
  <h3>Add New Habit</h3>
  <form class="new-habit-form" @submit.prevent="addHabit({ title, description })">
    <input v-model="title" placeholder="Title" />
    <textarea v-model="description" placeholder="Description"></textarea>
    <button type="submit">Add Habit</button>
  </form>
</template>

<script setup lang="ts">
const title = ref('');
const description = ref('');
const queryCache = useQueryCache();

const { mutate: addHabit } = useMutation({
  mutation: (data: { title: string; description: string }) => {
    return $fetch('/api/habits', {
      method: 'POST',
      body: data,
    });
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

<style scoped>
.new-habit-form {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 300px;
  margin-bottom: 20px;
}

.new-habit-form input,
.new-habit-form textarea {
  width: 100%;
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
