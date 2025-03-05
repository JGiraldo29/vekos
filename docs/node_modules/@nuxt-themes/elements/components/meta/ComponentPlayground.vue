<script lang="ts">
import type { PropType } from 'vue'
import Ellipsis from '../globals/Ellipsis.vue'
import ComponentPlaygroundData from './ComponentPlaygroundData.vue'
import type { NuxtComponentMetaNames } from '#nuxt-component-meta/types'

export default defineComponent({
  props: {
    component: {
      type: String as PropType<NuxtComponentMetaNames>,
      required: true
    },
    props: {
      type: Object,
      required: false,
      default: () => ({})
    }
  },
  async setup (props) {
    const as = computed(() => resolveComponent(props.component))

    const formProps = ref({
      ...props.props
    })

    const componentData = await useComponentMeta(props.component)

    return {
      as,
      formProps,
      componentData
    }
  },
  render (ctx: any) {
    const componentSlots = Object.entries(this.$slots as any).reduce(
      (acc, [key, slot]) => {
        if (key.startsWith('component-')) {
          const slotKey: string = key.replace('component-', '')
          acc[slotKey] = slot
        }

        return acc
      },
      {} as any
    )

    return h(
      'div',
      {
        class: 'component-playground'
      },
      [
        h(
          'div',
          {
            class: 'component-playground-wrapper'
          },
          [
            h(
              Ellipsis,
              {
                class: 'component-playground-ellipsis',
                blur: '5vw',
                height: '100%',
                width: '100%'
              }
            ),
            h(
              ctx.as,
              {
                ...ctx.formProps,
                class: 'component-playground-component'
              },
              {
                ...componentSlots
              }
            )
          ]
        ),
        h(
          ComponentPlaygroundData,
          {
            modelValue: ctx.formProps,
            componentData: ctx.componentData,
            'onUpdate:modelValue': val => (ctx.formProps = val)
          }
        )
      ]
    )
  }
})
</script>

<style scoped lang="ts">
css({
  '.component-playground': {
    border: '1px solid {color.gray.200}',
    borderRadius: '{radii.lg}',
    overflow: 'hidden',

    '@dark': {
      border: '1px solid {color.gray.800}',
    },

    '.component-playground-wrapper': {
      position: 'relative',
      padding: '{space.8}',
      overflow: 'hidden',
      background: 'linear-gradient(330deg, var(--color-gray-200) 0%, var(--color-gray-100) 100%)',

      '@dark': {
        background: 'linear-gradient(330deg, var(--color-gray-900) 0%, var(--color-gray-800) 100%)',
      },

      '.component-playground-ellipsis': {
        zIndex: '1'
      },

      '.component-playground-component': {
        zIndex: '50'
      }
    },
  }
})
</style>
