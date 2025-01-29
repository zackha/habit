<template>
  <div class="card">
    <slot />
  </div>
</template>

<style lang="postcss" scoped>
.card {
  @apply relative flex h-full w-full flex-col overflow-hidden rounded-[2.375rem] text-white;
  &::before {
    @apply absolute inset-0 rounded-[2.375rem] bg-white/5 dark:bg-black/50;
    box-shadow: inset 2px 4px 16px 0 hsla(0, 0%, 97%, 0.06);
    -webkit-backdrop-filter: blur(50px);
    backdrop-filter: blur(50px);
    content: '';
  }
  &::after {
    @apply pointer-events-none absolute inset-0 rounded-[2.375rem];
    border: 1.5px solid hsla(0, 0%, 100%, 0.05);
    -webkit-mask-image: linear-gradient(180deg, #000, transparent);
    mask-image: linear-gradient(180deg, #000, transparent);
    content: '';
  }
}
</style>
