<script setup lang="ts">
defineProps({
  /**
   * Label to display for the tab
   */
  label: {
    type: String,
    required: true
  },
  /**
   * Select which tab should be active
   * TODO: seems like it's not used 
   */
  active: {
    type: Boolean,
    default: false
  },
  /**
   * Preview block are bordered and have small padding.
   * TODO: seems like it's not used
   */
  preview: {
    type: Boolean,
    default: false
  }
})
</script>

<template>
  <div
    class="code-block"
    :class="{
      active,
      'rounded-lg p-4': preview,
    }"
  >
    <slot />
  </div>
</template>

<style scoped>
.code-block {
  display: none;
}

.code-block.active {
  display: block;
}
</style>
