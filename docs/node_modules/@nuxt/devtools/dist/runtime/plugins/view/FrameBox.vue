<script setup lang="ts">
import type { NuxtDevtoolsHostClient } from '@nuxt/devtools/types'
import { ref, watchEffect } from 'vue'
import { PANEL_MAX, PANEL_MIN, popupWindow, state } from './state'
import { useEventListener } from './utils'

const props = defineProps<{
  client: NuxtDevtoolsHostClient
  isDragging: boolean
}>()

const container = ref<HTMLElement>()
const isResizing = ref<false | { top?: boolean, left?: boolean, right?: boolean, bottom?: boolean }>(false)

watchEffect(() => {
  if (!container.value)
    return

  if (state.value.open) {
    const iframe = props.client.getIframe()
    if (!iframe)
      return

    iframe.style.pointerEvents = (isResizing.value || props.isDragging || props.client.inspector?.isEnabled.value)
      ? 'none'
      : 'auto'

    if (!popupWindow.value) {
      if (Array.from(container.value.children).every(el => el !== iframe))
        container.value.appendChild(iframe)
    }
  }
})

useEventListener(window, 'keydown', (e: KeyboardEvent) => {
  if (e.key === 'Escape' && props.client.inspector?.isEnabled.value) {
    e.preventDefault()
    props.client.inspector?.disable()
    props.client.devtools.close()
  }
})

// Close panel on outside click (when enabled)
useEventListener(window, 'mousedown', (e: MouseEvent) => {
  if (!state.value.closeOnOutsideClick)
    return
  if (popupWindow.value)
    return
  if (!state.value.open || isResizing.value || props.client.inspector?.isEnabled.value)
    return

  const matched = e.composedPath().find((_el) => {
    const el = _el as HTMLElement
    return Array.from(el.classList || []).some(c => c.startsWith('nuxt-devtools-'))
      || el.tagName?.toLowerCase() === 'iframe'
  })

  if (!matched)
    state.value.open = false
})

function handleResize(e: MouseEvent | TouchEvent) {
  if (!isResizing.value || !state.value.open)
    return

  const iframe = props.client.getIframe()
  if (!iframe)
    return

  const box = iframe.getBoundingClientRect()

  let widthPx: number, heightPx: number
  if (isResizing.value.right) {
    widthPx = Math.abs(e instanceof MouseEvent ? e.clientX : (e.touches[0]?.clientX || 0) - (box?.left || 0))
    state.value.width = Math.min(PANEL_MAX, Math.max(PANEL_MIN, widthPx / window.innerWidth * 100))
  }
  else if (isResizing.value.left) {
    widthPx = Math.abs((box?.right || 0) - (e instanceof MouseEvent ? e.clientX : (e.touches[0]?.clientX || 0)))
    state.value.width = Math.min(PANEL_MAX, Math.max(PANEL_MIN, widthPx / window.innerWidth * 100))
  }

  if (isResizing.value.top) {
    heightPx = Math.abs((box?.bottom || 0) - (e instanceof MouseEvent ? e.clientY : (e.touches[0]?.clientY || 0)))
    state.value.height = Math.min(PANEL_MAX, Math.max(PANEL_MIN, heightPx / window.innerHeight * 100))
  }
  else if (isResizing.value.bottom) {
    heightPx = Math.abs(e instanceof MouseEvent ? e.clientY : (e.touches[0]?.clientY || 0) - (box?.top || 0))
    state.value.height = Math.min(PANEL_MAX, Math.max(PANEL_MIN, heightPx / window.innerHeight * 100))
  }
}

useEventListener(window, 'mousemove', handleResize)
useEventListener(window, 'touchmove', handleResize)
useEventListener(window, 'mouseup', () => isResizing.value = false)
useEventListener(window, 'touchend', () => isResizing.value = false)
useEventListener(window, 'mouseleave', () => isResizing.value = false)
</script>

<template>
  <div
    v-show="state.open && !client.inspector?.isEnabled.value && !popupWindow"
    ref="container"
    class="nuxt-devtools-frame"
  >
    <!-- Handlers -->
    <div
      v-show="state.position !== 'top'"
      class="nuxt-devtools-resize-handle nuxt-devtools-resize-handle-horizontal"
      :style="{ top: 0 }"
      @mousedown.prevent="isResizing = { top: true }"
      @touchstart.passive="() => isResizing = { top: true }"
    />
    <div
      v-show="state.position !== 'bottom'"
      class="nuxt-devtools-resize-handle nuxt-devtools-resize-handle-horizontal"
      :style="{ bottom: 0 }"
      @mousedown.prevent="() => isResizing = { bottom: true }"
      @touchstart.passive="() => isResizing = { bottom: true }"
    />
    <div
      v-show="state.position !== 'left'"
      class="nuxt-devtools-resize-handle nuxt-devtools-resize-handle-vertical"
      :style="{ left: 0 }"
      @mousedown.prevent="() => isResizing = { left: true }"
      @touchstart.passive="() => isResizing = { left: true }"
    />
    <div
      v-show="state.position !== 'right'"
      class="nuxt-devtools-resize-handle nuxt-devtools-resize-handle-vertical"
      :style="{ right: 0 }"
      @mousedown.prevent="() => isResizing = { right: true }"
      @touchstart.passive="() => isResizing = { right: true }"
    />
    <div
      v-show="state.position !== 'top' && state.position !== 'left'"
      class="nuxt-devtools-resize-handle nuxt-devtools-resize-handle-corner"
      :style="{ top: 0, left: 0, cursor: 'nwse-resize' }"
      @mousedown.prevent="() => isResizing = { top: true, left: true }"
      @touchstart.passive="() => isResizing = { top: true, left: true }"
    />
    <div
      v-show="state.position !== 'top' && state.position !== 'right'"
      class="nuxt-devtools-resize-handle nuxt-devtools-resize-handle-corner"
      :style="{ top: 0, right: 0, cursor: 'nesw-resize' }"
      @mousedown.prevent="() => isResizing = { top: true, right: true }"
      @touchstart.passive="() => isResizing = { top: true, right: true }"
    />
    <div
      v-show="state.position !== 'bottom' && state.position !== 'left'"
      class="nuxt-devtools-resize-handle nuxt-devtools-resize-handle-corner"
      :style="{ bottom: 0, left: 0, cursor: 'nesw-resize' }"
      @mousedown.prevent="() => isResizing = { bottom: true, left: true }"
      @touchstart.passive="() => isResizing = { bottom: true, left: true }"
    />
    <div
      v-show="state.position !== 'bottom' && state.position !== 'right'"
      class="nuxt-devtools-resize-handle nuxt-devtools-resize-handle-corner"
      :style="{ bottom: 0, right: 0, cursor: 'nwse-resize' }"
      @mousedown.prevent="() => isResizing = { bottom: true, right: true }"
      @touchstart.passive="() => isResizing = { bottom: true, right: true }"
    />
  </div>
</template>

<style scoped>
.nuxt-devtools-frame{height:100%;position:fixed;width:100%;z-index:2147483645;-webkit-font-smoothing:antialiased}.nuxt-devtools-frame :deep(iframe){background:var(--nuxt-devtools-widget-bg);border:1px solid hsla(0,0%,49%,.2);border-radius:10px;height:100%;outline:none;width:100%}.nuxt-devtools-resize-handle-horizontal{border-radius:5px;cursor:ns-resize;height:10px;left:6px;margin:-5px 0;position:absolute;right:6px}.nuxt-devtools-resize-handle-vertical{border-radius:5px;bottom:0;cursor:ew-resize;margin:0 -5px;position:absolute;top:6px;width:10px}.nuxt-devtools-resize-handle-corner{border-radius:6px;height:14px;margin:-6px;position:absolute;width:14px}.nuxt-devtools-resize-handle:hover{background:hsla(0,0%,49%,.1)}
</style>
