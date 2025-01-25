<template>
  <div class="content-box">
    <slot />
  </div>
</template>

<style lang="postcss" scoped>
.content-box {
  box-shadow:
    inset 0.5px 0.5px 1px 0px rgba(255, 255, 255, 0.1),
    inset -0.5px -0.5px 1px 0px rgba(0, 0, 0, 0.1),
    rgba(0, 0, 0, 0.2) 0px 3px 10px -5px;
  @apply rounded-3xl;
}
</style>
