<script setup lang="ts">
import type { PropType } from 'vue'

defineProps({
  cta: {
    type: Array as PropType<string[]>,
    required: false,
    default: () => []
  },
  secondary: {
    type: Array as PropType<string[]>,
    required: false,
    default: () => []
  },
  video: {
    type: String,
    required: false,
    default: ''
  },
  snippet: {
    type: [Array, String] as PropType<string[] | string>,
    required: false,
    default: ''
  }
})
</script>

<template>
  <section class="block-hero">
    <div class="layout">
      <div class="content">
        <p v-if="$slots.announce" class="announce">
          <ContentSlot :use="$slots.announce" unwrap="p" />
        </p>

        <h1 class="title">
          <ContentSlot :use="$slots.title" unwrap="p">
            Hero Title
          </ContentSlot>
        </h1>

        <p class="description">
          <ContentSlot :use="$slots.description" unwrap="p">
            Hero default description.
          </ContentSlot>
        </p>

        <div v-if="$slots.extra" class="extra">
          <ContentSlot :use="$slots.extra" unwrap="p" />
        </div>

        <div class="actions">
          <ContentSlot v-if="$slots.actions" :use="$slots.actions" unwrap="p" />
          <template v-else>
            <ButtonLink v-if="cta" class="cta" bold size="medium" :href="(cta[1] as any)">
              {{ cta[0] }}
            </ButtonLink>
            <a v-if="secondary" :href="(secondary[1] as any)" class="secondary">
              {{ secondary[0] }}
            </a>
          </template>
        </div>
      </div>

      <div class="support">
        <slot name="support">
          <Terminal v-if="snippet" :content="snippet" />
          <VideoPlayer v-else-if="video" :src="video" />
        </slot>
      </div>
    </div>
  </section>
</template>

<style scoped lang="ts">
css({
  '.block-hero': {
    padding: '{space.20} 0',
    '@sm': {
      padding: '{space.24} 0',
    },
    '@lg': {
      padding: '{space.32} 0',
    },
    '.layout': {
      display: 'grid',
      gap: '{space.16}',
      '@lg': {
        gap: '{space.8}',
        gridTemplateColumns: 'repeat(3, minmax(0, 1fr))'
      }
    },
    '.content': {
      '@lg': {
        gridColumn: 'span 2 / span 2'
      },
      '.announce': {
        marginBottom: '{space.2}',
        textAlign: 'center',
        '@lg': {
          textAlign: 'start'
        }
      },
      '.title': {
        color: '{elements.text.primary.color.static}',
        fontWeight: '{fontWeight.bold}',
        letterSpacing: '{letterSpacing.tight}',
        textAlign: 'center',
        fontSize: '{text.4xl.fontSize}',
        lineHeight: '{text.4xl.lineHeight}',
        marginBottom: '{space.8}',
        px: '{space.8}',
        '@sm': {
          fontSize: '{text.5xl.fontSize}',
          lineHeight: '{text.5xl.lineHeight}',
        },
        '@lg': {
          px: '{space.0}',
          fontSize: '{text.6xl.fontSize}',
          lineHeight: '{text.6xl.lineHeight}',
          textAlign: 'start'
        }
      },
      '.description': {
        marginBottom: '{space.12}',
        fontSize: '{text.lg.fontSize}',
        lineHeight: '{text.lg.lineHeight}',
        textAlign: 'center',
        color: '{elements.text.secondary.color.static}',
        px: '{space.2}',
        '@lg': {
          textAlign: 'start'
        }
      },
      '.extra': {
        marginBottom: '{space.16}',
        display: 'flex',
        justifyContent: 'center',
        '@lg': {
          justifyContent: 'flex-start'
        }
      },
      '.actions': {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '{space.4}',
        '@sm': {
          flexDirection: 'row',
          gap: '{space.6}'
        },
        '@lg': {
          justifyContent: 'flex-start'
        },
        '.cta': {
          marginBottom: 0
        },
        '.secondary': {
          fontWeight: '{fontWeight.medium}',
          color: '{elements.text.secondary.color.static}',
          '&:hover': {
            color: '{elements.text.secondary.color.hover}'
          }
        }
      }
    }
  }
})
</style>
