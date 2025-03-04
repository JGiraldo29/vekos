<script setup lang="ts">
import { PropType } from 'vue'
import { useClipboard } from '@vueuse/core'

const props = defineProps({
  content: {
    type: [Array, String] as PropType<string[] | string>,
    required: true
  }
})

const { copy: copyToClipboard } = useClipboard()

const state = ref('init')

const lines = computed(() => {
  if (typeof props.content === 'string') { return [props.content] }
  return props.content
})

const copy = (e: MouseEvent) => {
  copyToClipboard(lines.value.join('\n'))
    .then(() => {
      state.value = 'copied'

      setTimeout(() => {
        state.value = 'init'
      }, 1000)
    })
    .catch(() => {
      console.warn("Couldn't copy to clipboard!")
    })
}
</script>

<template>
  <div class="terminal" @click="copy">
    <div v-if="state === 'copied'" class="copied">
      <div class="scrim" />
      <div class="content">
        Copied!
      </div>
    </div>
    <div class="header">
      <div class="controls">
        <div />
        <div />
        <div />
      </div>
      <div class="title">
        Bash
      </div>
    </div>
    <div class="window">
      <span v-for="line in lines" :key="line" class="line">
        <span class="sign">$</span>
        <span class="content">{{ line }}</span>
      </span>
    </div>
    <div v-if="state !== 'copied'" class="prompt">
      Click to copy
    </div>
  </div>
</template>

<style scoped lang="ts">
css({
  '.terminal': {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    maxWidth: '{space.128}',
    height: '{space.64}',
    mx: 'auto',
    cursor: 'pointer',
    overflow: 'hidden',
    border: '1px solid {elements.border.secondary.static}',
    borderRadius: '{radii.lg}',
    background: '{elements.surface.background.base}',
    '.copied': {
      position: 'absolute',
      top: 0,
      insetInlineStart: 0,
      zIndex: 10,
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      '.scrim': {
        position: 'absolute',
        top: 0,
        insetInlineStart: 0,
        width: '100%',
        height: '100%',
        background: '{color.gray.500}',
        opacity: '0.75',
        '@dark': {
          background: '{color.gray.900}',
        }
      },
      '.content': {
        zIndex: 10,
        fontWeight: '{fontWeight.semibold}',
        color: '{color.gray.100}',
        fontSize: '{fontSize.lg}'
      }
    },
    '.header': {
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      borderBottom: '1px solid {elements.border.secondary.static}',
      width: '100%',
      height: '{space.12}',
      '.controls': {
        display: 'flex',
        marginInlineStart: '{space.4}',
        div: {
          '&:nth-child(1)': {
            width: '{space.3}',
            height: '{space.3}',
            borderRadius: '{radii.full}',
            background: '{color.red.400}'
          },
          '&:nth-child(2)': {
            width: '{space.3}',
            height: '{space.3}',
            borderRadius: '{radii.full}',
            background: '{color.yellow.400}',
            marginInlineStart: '{space.2}'
          },
          '&:nth-child(3)': {
            width: '{space.3}',
            height: '{space.3}',
            borderRadius: '{radii.full}',
            background: '{color.green.400}',
            marginInlineStart: '{space.2}'
          },
        }
      },
      '.title': {
        position: 'absolute',
        top: 0,
        insetInlineStart: 0,
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: '{fontWeight.semibold}',
        fontFamily: '{font.mono}'
      }
    },
    '.window': {
      display: 'flex',
      flexDirection: 'column',
      flex: '1 1 0%',
      padding: '{space.4}',
      fontFamily: '{font.mono}',
      fontSize: '{text.sm.fontSize}',
      '.line': {
        display: 'flex',
        marginBottom: '{space.1}',
      },
      '.sign': {
        marginInlineEnd: '{space.2}',
        display: 'inline-block',
        userSelect: 'none',
        fontWeight: '{fontWeight.bold}'
      },
      '.content': {
        display: 'inline-block',
      }
    },
    '.prompt': {
      paddingTop: '{space.2}',
      paddingBottom: '{space.2}',
      fontWeight: '{fontWeight.semibold}',
      textAlign: 'center',
      opacity: 0,
    },
    '&:hover .prompt': {
      opacity: 1
    }
  }
})
</style>
