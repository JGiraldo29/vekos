<template>
  <div class="component-playground-data">
    <TabsHeader :active-tab-index="activeTabIndex" :tabs="tabs" @update:active-tab-index="updateTab" />
    <ComponentPlaygroundProps v-if="activeTabIndex === 0" v-model="formData" :component-data="componentData" />
    <ComponentPlaygroundSlots v-if="activeTabIndex === 1" :component-data="componentData" />
    <ComponentPlaygroundTokens v-if="activeTabIndex === 2" :component-data="componentData" />
  </div>
</template>

<script setup lang="ts">
import { useVModel } from '@vueuse/core'

const props = defineProps({
  modelValue: {
    type: Object,
    required: false,
    default: () => ({})
  },
  componentData: {
    type: Object,
    required: false,
    default: () => ({})
  }
})

const emits = defineEmits(['update:modelValue'])

const formData = useVModel(props, 'modelValue', emits)

const activeTabIndex = ref(0)

const tabs = [
  {
    label: 'Props'
  },
  {
    label: 'Slots'
  },
  {
    label: 'Design Tokens'
  }
]

const updateTab = (i: number) => (activeTabIndex.value = i)
</script>

<style scoped lang="ts">
css({
  '.component-playground-data': {
    '.component-playground-data-section': {
      padding: '{space.4}',
      '@dark': {
        backgroundColor: '{color.gray.900}',
      }
    }
  }
})
</style>
