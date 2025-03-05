<template>
  <div class="component-playground-data-section">
    {{ componentData }}
  </div>
</template>

<script setup lang="ts">
defineProps({
  componentData: {
    type: Object,
    required: true
  }
})
</script>
