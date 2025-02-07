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

const { clear } = useUserSession();
const confirmDeleteAccount = ref(false);
const confirmationText = ref('');

const closeDeleteConfirmation = () => {
  confirmationText.value = '';
  confirmDeleteAccount.value = false;
};

const { mutate: deleteAccount } = useMutation({
  mutation: () => $fetch(`/api/users`, { method: 'DELETE' }),

  async onSuccess() {
    await clear();
    await navigateTo('/');
    await queryCache.invalidateQueries({ key: ['user'] });
  },
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
      <ContentBox class="flex flex-col gap-3 bg-white/10 p-4 backdrop-blur-2xl dark:bg-neutral-200/5">
        <div class="flex flex-col gap-2">
          <div class="text-sm font-semibold text-white">Delete account</div>
          <div class="text-xs text-white/60">
            Permanently delete your account, including all associated data such as habits, progress records, and profile information. Once deleted, this action cannot be undone,
            and you will not be able to recover your habits or any other data linked to your account.
          </div>
        </div>
        <div class="flex items-center">
          <button @click="confirmDeleteAccount = true" class="button bg-red-600 px-3.5 py-1.5 font-semibold text-red-100 hover:bg-red-700">Delete my account</button>
        </div>
      </ContentBox>
    </UForm>
  </div>
  <UModal
    v-model="confirmDeleteAccount"
    :ui="{ container: 'items-center', width: 'w-80', background: '', shadow: '', overlay: { base: 'backdrop-blur-2xl', background: 'bg-white/5 dark:bg-black/60' } }">
    <ContentBox class="flex flex-col gap-5 bg-white/10 p-6 backdrop-blur-2xl dark:bg-neutral-200/5">
      <div class="text-center text-xl font-semibold">Delete Account</div>
      <p class="px-6 text-center text-sm text-red-500">WARNING this is permanent and cannot be undone!</p>
      <p class="text-xs text-neutral-400">
        Permanently delete your account, including all associated data such as habits, progress records, and profile information. Once deleted, this action cannot be undone, and
        you will not be able to recover your habits or any other data linked to your account.
      </p>
      <p class="text-xs text-neutral-400">
        To confirm deletion, please type
        <strong>DELETE</strong>
        in the box below.
      </p>
      <UInput color="red" v-model="confirmationText" placeholder="Type DELETE here..." />
      <div class="flex items-center gap-4">
        <UButton color="gray" class="flex-1 justify-center" @click="closeDeleteConfirmation">Close</UButton>
        <UButton color="red" :disabled="confirmationText.toLowerCase() !== 'delete'" @click="deleteAccount()">Delete my account</UButton>
      </div>
    </ContentBox>
  </UModal>
</template>
