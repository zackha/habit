<template>
  <div class="rmterp" style="background-image: url('/bg/bg1.jpg')">
    <div class="fzypcq">
      <slot />
    </div>
  </div>
</template>

<style lang="postcss" scoped>
.rmterp {
  @apply relative z-10 box-border flex min-h-screen flex-col justify-center bg-cover bg-center;
}

.fzypcq {
  @apply mx-auto box-border grid w-full max-w-sm gap-4 px-5;
}
</style>
