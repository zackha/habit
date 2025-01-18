<template>
  <div class="rmterp">
    <div class="fzypcq">
      <slot />
    </div>
  </div>
</template>

<style lang="postcss" scoped>
.rmterp {
  @apply relative z-10 min-h-screen flex flex-col justify-center box-border;
}

.fzypcq {
  @apply max-w-72 w-full mx-auto px-5 box-border grid gap-8;
}
</style>
