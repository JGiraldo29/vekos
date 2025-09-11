<script setup lang="ts">
import type { PropType } from 'vue'

type HTMLElementsTags = keyof HTMLElementTagNameMap

defineProps({
  as: {
    type: String as PropType<HTMLElementsTags>,
    required: false,
    default: 'div'
  },
  ...variants
})
</script>

<template>
  <component :is="as" class="container">
    <slot />
  </component>
</template>

<style lang="ts" scoped>
css({
  '.container': {
    marginInlineStart: 'auto',
    marginInlineEnd: 'auto',
    width: '100%'
  },
  variants: {
    padded: {
      true: {
        px: '{elements.container.padding.mobile}',
        '@xs': {
          px: '{elements.container.padding.xs}',
        },
        '@sm': {
          px: '{elements.container.padding.sm}',
        },
        '@md': {
          px: '{elements.container.padding.md}',
        }
      },
      options: {
        default: true
      }
    },
    fluid: {
      true: {},
      false: {
        maxWidth: '{elements.container.maxWidth}'
      },
      options: {
        default: false
      }
    }
  }
})
</style>
