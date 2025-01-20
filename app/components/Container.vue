<template>
  <div class="rmterp">
    <div class="fzypcq">
      <slot />
    </div>
  </div>
</template>

<style lang="postcss" scoped>
.rmterp {
  @apply relative z-10 box-border flex min-h-screen flex-col justify-center;
}

.fzypcq {
  @apply mx-auto box-border grid w-full max-w-sm gap-4 px-5;
}
</style>
