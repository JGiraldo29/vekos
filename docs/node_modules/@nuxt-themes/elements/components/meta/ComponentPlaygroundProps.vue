<template>
  <div class="component-playground-data-section">
    <div v-for="prop of componentProps" :key="prop.name">
      <div :id="prop.name" class="prop-title">
        <ProseH4 :id="prop.name">
          {{ prop.name }}
        </ProseH4>
        <span>
          <ProseCodeInline>
            {{ prop.type }}
          </ProseCodeInline>
          <Badge v-if="!prop.required">
            Required
          </Badge>
        </span>
      </div>
      <ProseP v-if="prop.description">
        {{ prop.description }}
      </ProseP>
      <input :value="formData[prop.name]" @change="(event) => propChange(event, prop.name)">
    </div>
  </div>
</template>

<script setup lang="ts">
import { useVModel } from '@vueuse/core'

const props = defineProps({
  modelValue: {
    type: Object,
    required: true
  },
  componentData: {
    type: Object,
    required: true
  }
})

const emits = defineEmits(['update:modelValue'])

const formData = useVModel(props, 'modelValue', emits)

const propChange = (event: any, propName: any) => {
  formData.value = {
    ...formData.value,
    [propName]: event.target.value
  }
}

const componentProps = computed(() => props?.componentData?.meta?.props)
</script>

<style lang="ts" scoped>
css({
  '.prop-title': {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    my: '{space.4}',
    h4: {
      fontSize: '{fontSize.2xl}',
      fontWeight: '{fontWeight.black}',
      lineHeight: '1',
      my: '{space.4}',
      '@mq.md': {
        my: '{space.0}'
      }
    },
    span: {
      display: 'flex',
      alignItems: 'center',
      gap: '{space.4}',
    },
    '@mq.md': {
      flexDirection: 'row',
      justifyContent: 'space-between',
    }
  },
  input: {
    px: '{space.2}',
    py: '{space.1}',
    borderRadius: '{radii.sm}',
    border: '1px solid {color.gray.200}',
    '@dark': {
      border: '1px solid {color.gray.800}',
    }
  }
})
</style>
