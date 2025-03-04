<template>
  <div class="component-playground-data-section">
    <pre>{{ JSON.stringify(componentData, null, 2) }}</pre>
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
