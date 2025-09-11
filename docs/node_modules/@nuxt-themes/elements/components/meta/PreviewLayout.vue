<template>
  <div class="preview-layout">
    <slot />
  </div>
</template>

<style scoped lang="ts">
css({
  '.preview-layout': {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
})
</style>