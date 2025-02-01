<script setup lang="ts">
import { z } from 'zod';
import type { FormSubmitEvent } from '#ui/types';
import type { User } from '~~/server/utils/db';
const { user } = useUserSession();


const schema = z.object({
  isPublic: z.boolean(),
});

type Schema = z.output<typeof schema>;

const formState = reactive<Schema>({
  isPublic: user.value?.habitUser?.public || false
});

const queryCache = useQueryCache();
const emit = defineEmits<{
  (e: 'profileUpdated'): void;
}>();

const { mutate: updateUserProfile } = useMutation({
  mutation: (data: Schema) => {
    return $fetch('/api/user', {
      method: 'PATCH',
      body: data,
    }) as Promise<User>;
  },

  async onSuccess() {
    await queryCache.invalidateQueries({ key: ['user'] });
    await useUserSession().fetch();
    emit('profileUpdated');
  },

  onSettled() {
    formState.isPublic = user.value?.habitUser?.public || false
  },
});

async function onSubmit(event: FormSubmitEvent<Schema>) {
  updateUserProfile(event.data);
}
</script>

<template>
  <div class="p-8">
    <UForm :schema="schema" :state="formState" class="flex flex-col gap-4" @submit="onSubmit">
      <h2 class="text-lg font-medium">Profile settings</h2>
      <UFormGroup name="title">
        <div class="input-container">
          <UCheckbox v-model="formState.isPublic" placeholder="Public profile" label="Public profile"/>
        </div>
      </UFormGroup>
      <button type="submit" class="button bg-green-400 px-2.5 py-3 font-semibold text-green-950 outline-none hover:bg-green-300">Save profile</button>
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
