<script setup lang="ts">
import { z } from 'zod';

const props = defineProps<{ user: User }>();
const emit = defineEmits<{ (e: 'profileUpdated'): void }>();

const schema = z.object({ userView: z.boolean() });
type Schema = z.infer<typeof schema>;

const formState = reactive<Schema>({
  userView: !!props.user.userView,
});

const queryCache = useQueryCache();

const { mutate: editProfile } = useMutation({
  mutation: (data: Schema) =>
    $fetch('/api/users', {
      method: 'PATCH',
      body: data,
    }) as Promise<User>,

  async onSuccess() {
    await queryCache.invalidateQueries({ key: ['user'] });
    emit('profileUpdated');
  },

  onSettled() {
    formState.userView = !!props.user.userView;
  },
});

const updateProfile = () => {
  editProfile({ userView: formState.userView });
};

const accountVisibilityMessage = computed(() => {
  return formState.userView
    ? 'Your profile is <strong>public</strong>. Habits set to public can be viewed by anyone, even without logging in.'
    : 'Your profile is <strong>private</strong>. Only you can view your habits.';
});
</script>

<template>
  <div class="p-8">
    <UForm :schema="schema" :state="formState" class="flex flex-col gap-4">
      <ContentBox class="flex items-center justify-between gap-14 bg-white/10 p-4 backdrop-blur-2xl dark:bg-neutral-200/5">
        <div class="flex flex-col gap-1">
          <div class="text-sm font-semibold text-white">Public Account</div>
          <div class="text-xs text-white/60" v-html="accountVisibilityMessage"></div>
        </div>
        <UFormGroup name="userView">
          <UToggle v-model="formState.userView" @update:model-value="updateProfile" />
        </UFormGroup>
      </ContentBox>
    </UForm>
  </div>
</template>
