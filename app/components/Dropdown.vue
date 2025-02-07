<script setup lang="ts">
defineProps<{ user: User }>();
const { clear } = useUserSession();
const openEditProfile = ref(false);
const colorMode = useColorMode();

const isDarkMode = computed({
  get: () => colorMode.preference === 'dark',
  set: () => (colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'),
});
</script>

<template>
  <UPopover :popper="{ placement: 'bottom-end' }" :ui="{ background: '', shadow: '', ring: '' }">
    <button class="button bg-white/20 p-1.5 hover:bg-white/25">
      <UIcon name="i-heroicons-cog-8-tooth" class="h-5 w-5" />
    </button>
    <template #panel="{ close }">
      <div class="dropdown">
        <div
          @click="
            () => {
              close();
              openEditProfile = true;
            }
          "
          class="m-2 flex w-36 cursor-pointer items-center gap-3 rounded-lg p-2 transition hover:bg-black/30">
          <UAvatar :src="user?.avatarUrl" size="md" />
          <div class="flex flex-col">
            <div class="line-clamp-1 font-medium">{{ user?.name }}</div>
            <div>@{{ user?.login }}</div>
          </div>
        </div>
        <div class="border-b border-white/10"></div>
        <div @click="isDarkMode = !isDarkMode" class="m-1 flex cursor-pointer items-center gap-3 rounded-lg p-2 transition hover:bg-black/30">
          <UIcon :name="colorMode.preference === 'dark' || colorMode.preference === 'system' ? 'i-heroicons-moon' : 'i-heroicons-sun'" class="h-5 w-5" />
          <span>Dark mode</span>
        </div>
        <div class="border-b border-white/5"></div>
        <div @click="clear()" class="m-1 flex cursor-pointer items-center gap-3 rounded-lg p-2 transition hover:bg-black/30">
          <UIcon name="i-heroicons-arrow-right-on-rectangle-20-solid" class="h-5 w-5" />
          <span>Sign out</span>
        </div>
      </div>
    </template>
  </UPopover>
  <UModal
    v-model="openEditProfile"
    :ui="{ container: 'items-center', width: 'w-96', background: '', shadow: '', overlay: { base: 'backdrop-blur-2xl', background: 'bg-white/5 dark:bg-black/60' } }">
    <ProfileForm :user="user" />
  </UModal>
</template>

<style lang="postcss">
.dropdown {
  @apply mt-1 flex select-none flex-col rounded-xl border border-white/5 text-sm text-white/80;
  background: hsla(0, 0%, 100%, 0.05);
  box-shadow:
    0 24px 32px -12px hsla(0, 0%, 7%, 0.1),
    inset 2px 4px 16px 0 hsla(0, 0%, 97%, 0.06);
  -webkit-backdrop-filter: blur(50px);
  backdrop-filter: blur(50px);
}
</style>
