import { defineTheme } from 'pinceau'
import theme from '@nuxt-themes/tokens/config'

export default defineTheme({
  // @ts-ignore
  color: {
    primary: theme.color.teal
  },

  space: {
    // TODO: move to tokens
    128: '32rem'
  },

  elements: {
    $schema: {
      title: 'All the configurable tokens for your Elements.',
      tags: [
        '@studioIcon uiw:component'
      ]
    },
    text: {
      primary: {
        color: {
          static: {
            initial: '{color.gray.900}',
            dark: '{color.gray.50}'
          },
          // TODO: add `hover` state
          hover: {}
        }
      },
      secondary: {
        color: {
          static: {
            initial: '{color.gray.500}',
            dark: '{color.gray.400}'
          },
          hover: {
            initial: '{color.gray.700}',
            dark: '{color.gray.200}'
          }
        }
      }
    },

    container: {
      $schema: {
        title: 'Main container sizings.',
        tags: [
          '@studioInput design-token',
          '@studioInputTokenType size',
          '@studioIcon material-symbols:width-full-outline'
        ]
      },
      maxWidth: '80rem',
      padding: {
        mobile: '{space.4}',
        xs: '{space.4}',
        sm: '{space.6}',
        md: '{space.6}'
      }
    },

    backdrop: {
      $schema: {
        title: 'Backdrops used in Elements.',
        tags: [
          '@studioInput design-token',
          '@studioInputTokenType size',
          '@studioIcon material-symbols:blur-circular'
        ]
      },
      // TODO: add filter tokens in `tokens` package
      filter: 'saturate(200%) blur(20px)',
      background: {
        // TODO: rgba 80% from color.white
        initial: '#fffc',
        // TODO: rgba 80% from color.black
        dark: '#0c0d0ccc'
      }
    },

    border: {
      $schema: {
        title: 'Borders used in Elements.',
        tags: [
          '@studioInput design-token',
          '@studioInputTokenType color',
          '@studioIcon material-symbols:border-all-outline-rounded'
        ]
      },
      primary: {
        static: {
          initial: '{color.gray.100}',
          dark: '{color.gray.900}'
        },
        hover: {
          initial: '{color.gray.200}',
          dark: '{color.gray.800}'
        }
      },
      secondary: {
        static: {
          initial: '{color.gray.200}',
          dark: '{color.gray.800}'
        },
        hover: {
          initial: '',
          dark: ''
        }
      }
    },

    surface: {
      $schema: {
        title: 'Surfaces used in Elements.',
        tags: [
          '@studioInput design-token',
          '@studioInputTokenType color',
          '@studioIcon fluent:surface-hub-20-filled'
        ]
      },
      background: {
        base: {
          initial: '{color.gray.100}',
          dark: '{color.gray.900}'
        }
      }
    },

    state: {
      $schema: {
        title: 'Color states used in Elements.',
        tags: [
          '@studioInput design-token',
          '@studioInputTokenType color',
          '@studioIcon mdi:palette-advanced'
        ]
      },
      primary: {
        color: {
          primary: {
            initial: '{color.primary.600}',
            dark: '{color.primary.400}'
          },
          secondary: {
            initial: '{color.primary.700}',
            dark: '{color.primary.200}'
          }
        },
        backgroundColor: {
          primary: {
            initial: '{color.primary.50}',
            dark: '{color.primary.900}'
          },
          secondary: {
            initial: '{color.primary.100}',
            dark: '{color.primary.800}'
          }
        },
        borderColor: {
          primary: {
            initial: '{color.primary.100}',
            dark: '{color.primary.800}'
          },
          secondary: {
            initial: '{color.primary.200}',
            dark: '{color.primary.700}'
          }
        }
      },
      info: {
        color: {
          primary: {
            initial: '{color.blue.500}',
            dark: '{color.blue.400}'
          },
          secondary: {
            initial: '{color.blue.600}',
            dark: '{color.blue.200}'
          }
        },
        backgroundColor: {
          primary: {
            initial: '{color.blue.50}',
            dark: '{color.blue.900}'
          },
          secondary: {
            initial: '{color.blue.100}',
            dark: '{color.blue.800}'
          }
        },
        borderColor: {
          primary: {
            initial: '{color.blue.100}',
            dark: '{color.blue.800}'
          },
          secondary: {
            initial: '{color.blue.200}',
            dark: '{color.blue.700}'
          }
        }
      },
      success: {
        color: {
          primary: {
            initial: '{color.green.500}',
            dark: '{color.green.400}'
          },
          secondary: {
            initial: '{color.green.600}',
            dark: '{color.green.200}'
          }
        },
        backgroundColor: {
          primary: {
            initial: '{color.green.50}',
            dark: '{color.green.900}'
          },
          secondary: {
            initial: '{color.green.100}',
            dark: '{color.green.800}'
          }
        },
        borderColor: {
          primary: {
            initial: '{color.green.100}',
            dark: '{color.green.800}'
          },
          secondary: {
            initial: '{color.green.200}',
            dark: '{color.green.700}'
          }
        }
      },
      warning: {
        color: {
          primary: {
            initial: '{color.yellow.600}',
            dark: '{color.yellow.400}'
          },
          secondary: {
            initial: '{color.yellow.700}',
            dark: '{color.yellow.200}'
          }
        },
        backgroundColor: {
          primary: {
            initial: '{color.yellow.50}',
            dark: '{color.yellow.900}'
          },
          secondary: {
            initial: '{color.yellow.100}',
            dark: '{color.yellow.800}'
          }
        },
        borderColor: {
          primary: {
            initial: '{color.yellow.100}',
            dark: '{color.yellow.800}'
          },
          secondary: {
            initial: '{color.yellow.200}',
            dark: '{color.yellow.700}'
          }
        }
      },
      danger: {
        color: {
          primary: {
            initial: '{color.red.500}',
            dark: '{color.red.300}'
          },
          secondary: {
            initial: '{color.red.600}',
            dark: '{color.red.200}'
          }
        },
        backgroundColor: {
          primary: {
            initial: '{color.red.50}',
            dark: '{color.red.900}'
          },
          secondary: {
            initial: '{color.red.100}',
            dark: '{color.red.800}'
          }
        },
        borderColor: {
          primary: {
            initial: '{color.red.100}',
            dark: '{color.red.800}'
          },
          secondary: {
            initial: '{color.red.200}',
            dark: '{color.red.700}'
          }
        }
      }
    }
  },

  utils: {
    stateColors: (value: any) => {
      return {
        color: `{elements.state.${value}.color.primary} !important`,
        backgroundColor: `{elements.state.${value}.backgroundColor.primary} !important`,
        borderColor: `{elements.state.${value}.borderColor.primary} !important`,
        ':deep(p code)': {
          color: `{elements.state.${value}.color.secondary} !important`,
          backgroundColor: `{elements.state.${value}.backgroundColor.secondary} !important`
        },
        ':deep(code)': {
          color: `{elements.state.${value}.color.primary} !important`,
          backgroundColor: `{elements.state.${value}.backgroundColor.secondary} !important`
        },
        ':deep(a code)': {
          borderColor: `{elements.state.${value}.borderColor.primary} !important`
        },
        ':deep(a)': {
          borderColor: 'currentColor',
          code: {
            backgroundColor: `{elements.state.${value}.backgroundColor.primary} !important`
          },
          '&:hover': {
            color: `{elements.state.${value}.color.secondary} !important`,
            borderColor: 'currentColor !important',
            code: {
              backgroundColor: `{elements.state.${value}.backgroundColor.secondary} !important`,
              color: `{elements.state.${value}.color.secondary} !important`,
              borderColor: `{elements.state.${value}.borderColor.secondary} !important`
            }
          }
        }
      }
    }
  }
})
