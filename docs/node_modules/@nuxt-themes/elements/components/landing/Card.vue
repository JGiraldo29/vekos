<script setup lang="ts">
defineProps({
  icon: {
    type: String,
    default: ''
  }
})
</script>

<template>
  <div class="card">
    <Icon v-if="icon" :name="icon" />
    <slot />
    <div>
      <h3 class="title">
        <ContentSlot :use="$slots.title" unwrap="p">
          Card title
        </ContentSlot>
      </h3>
      <p class="description">
        <ContentSlot :use="$slots.description" unwrap="p">
          Card description
        </ContentSlot>
      </p>
    </div>
  </div>
</template>

<style scoped lang="ts">
css({
  '.card': {
    display: 'block',
    position: 'relative',
    width: '100%',
    padding: '{space.8}',
    borderRadius: '{radii.xl}',
    border: '1px solid {elements.border.primary.static}',
    background: '{elements.backdrop.background}',
    backdropFilter: '{elements.backdrop.filter}',
    '.icon': {
      display: 'inline-block',
      marginBottom: '{space.2}',
      width: '{space.6}',
      height: '{space.6}'
    },
    '.title': {
      marginBottom: '{space.2}',
      fontSize: '{text.lg.fontSize}',
      lineHeight: '{text.lg.lineHeight}',
      fontWeight: '{fontWeight.semibold}',
      color: '{elements.text.primary.color.static}'
    },
    '.description': {
      fontSize: '{text.sm.fontSize}',
      lineHeight: '{text.sm.lineHeight}',
      fontWeight: '{fontWeight.medium}',
      color: '{elements.text.secondary.color.static}'
    }
  }
})
</style>
