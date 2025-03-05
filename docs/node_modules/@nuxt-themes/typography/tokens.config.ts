import { defineTheme } from 'pinceau'

export default defineTheme({
  typography: {
    $schema: {
      title: 'All the configurable tokens for your Typography.',
      tags: [
        '@studioInput design-token',
        '@studioInputTokenType color',
        '@studioIcon material-symbols:article'
      ]
    },
    body: {
      color: {
        initial: '{color.black}',
        dark: '{color.white}'
      },
      backgroundColor: {
        initial: '{color.white}',
        dark: '{color.black}'
      }
    },
    verticalMargin: {
      $schema: {
        title: 'Vertical spacings between paragraphs.',
        tags: [
          '@studioInput design-token',
          '@studioInputTokenType size',
          '@studioIcon mingcute:line-height-line'
        ]
      },
      sm: '16px',
      base: '24px'
    },
    letterSpacing: {
      $schema: {
        title: 'Horizontal spacings between letters.',
        tags: [
          '@studioInput design-token',
          '@studioInputTokenType size',
          '@studioIcon mingcute:letter-spacing-line'
        ]
      },
      tight: '-0.025em',
      wide: '0.025em'
    },
    fontSize: {
      $schema: {
        title: 'Horizontal spacings between letters.',
        tags: [
          '@studioInput design-token',
          '@studioInputTokenType font-size',
          '@studioIcon mingcute:font-size-fill'
        ]
      },
      xs: '12px',
      sm: '14px',
      base: '16px',
      lg: '18px',
      xl: '20px',
      '2xl': '24px',
      '3xl': '30px',
      '4xl': '36px',
      '5xl': '48px',
      '6xl': '60px',
      '7xl': '72px',
      '8xl': '96px',
      '9xl': '128px'
    },
    fontWeight: {
      $schema: {
        title: 'Font weights used in typography.',
        tags: [
          '@studioInput design-token',
          '@studioInputTokenType font-size',
          '@studioIcon mingcute:bold-fill'
        ]
      },
      thin: '100',
      extralight: '200',
      light: '300',
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
      extrabold: '800',
      black: '900'
    },
    lead: {
      $schema: {
        title: 'Line heights used in your typography.',
        tags: [
          '@studioInput design-token',
          '@studioInputTokenType font-size',
          '@studioIcon material-symbols:height-rounded'
        ]
      },
      1: '.025rem',
      2: '.5rem',
      3: '.75rem',
      4: '1rem',
      5: '1.25rem',
      6: '1.5rem',
      7: '1.75rem',
      8: '2rem',
      9: '2.25rem',
      10: '2.5rem',
      none: '1',
      tight: '1.25',
      snug: '1.375',
      normal: '1.5',
      relaxed: '1.625',
      loose: '2'
    },
    font: {
      $schema: {
        title: 'Your typography fonts',
        tags: [
          '@studioInput design-token',
          '@studioInputTokenType font',
          '@studioIcon material-symbols:font-download-rounded'
        ]
      },
      display: '{font.sans}',
      body: '{font.sans}',
      code: '{font.mono}'
    },
    color: {
      $schema: {
        title: 'Your typography color palette.',
        tags: [
          '@studioInput design-token',
          '@studioInputTokenType color',
          '@studioIcon ph:palette'
        ]
      },
      primary: {
        50: '{color.primary.50}',
        100: '{color.primary.100}',
        200: '{color.primary.200}',
        300: '{color.primary.300}',
        400: '{color.primary.400}',
        500: '{color.primary.500}',
        600: '{color.primary.600}',
        700: '{color.primary.700}',
        800: '{color.primary.800}',
        900: '{color.primary.900}'
      },
      secondary: {
        50: '{color.secondary.50}',
        100: '{color.secondary.100}',
        200: '{color.secondary.200}',
        300: '{color.secondary.300}',
        400: '{color.secondary.400}',
        500: '{color.secondary.500}',
        600: '{color.secondary.600}',
        700: '{color.secondary.700}',
        800: '{color.secondary.800}',
        900: '{color.secondary.900}'
      }
    }
  },
  prose: {
    $schema: {
      title: 'All the configurable tokens for your Prose components.',
      tags: [
        '@studioInput design-token',
        '@studioInputTokenType font-size',
        '@studioIcon lucide:component'
      ]
    },
    p: {
      fontSize: '{typography.fontSize.base}',
      lineHeight: '{typography.lead.normal}',
      margin: '{typography.verticalMargin.base} 0',
      br: {
        margin: '{typography.verticalMargin.base} 0 0 0'
      }
    },
    h1: {
      margin: '0 0 2rem',
      fontSize: '{typography.fontSize.5xl}',
      lineHeight: '{typography.lead.tight}',
      fontWeight: '{typography.fontWeight.bold}',
      letterSpacing: '{typography.letterSpacing.tight}',
      iconSize: '{typography.fontSize.3xl}'
    },
    h2: {
      margin: '3rem 0 2rem',
      fontSize: '{typography.fontSize.4xl}',
      lineHeight: '{typography.lead.tight}',
      fontWeight: '{typography.fontWeight.semibold}',
      letterSpacing: '{typography.letterSpacing.tight}',
      iconSize: '{typography.fontSize.2xl}'
    },
    h3: {
      margin: '3rem 0 2rem',
      fontSize: '{typography.fontSize.3xl}',
      lineHeight: '{typography.lead.snug}',
      fontWeight: '{typography.fontWeight.semibold}',
      letterSpacing: '{typography.letterSpacing.tight}',
      iconSize: '{typography.fontSize.xl}'
    },
    h4: {
      margin: '3rem 0 2rem',
      fontSize: '{typography.fontSize.2xl}',
      lineHeight: '{typography.lead.snug}',
      fontWeight: '{typography.fontWeight.semibold}',
      letterSpacing: '{typography.letterSpacing.tight}',
      iconSize: '{typography.fontSize.lg}'
    },
    h5: {
      margin: '3rem 0 2rem',
      fontSize: '{typography.fontSize.xl}',
      lineHeight: '{typography.lead.snug}',
      fontWeight: '{typography.fontWeight.semibold}',
      iconSize: '{typography.fontSize.lg}'
    },
    h6: {
      margin: '3rem 0 2rem',
      fontSize: '{typography.fontSize.lg}',
      lineHeight: '{typography.lead.normal}',
      fontWeight: '{typography.fontWeight.semibold}',
      iconSize: '{typography.fontSize.base}'
    },
    strong: {
      fontWeight: '{typography.fontWeight.semibold}'
    },
    img: {
      margin: '{typography.verticalMargin.base} 0'
    },
    a: {
      textDecoration: 'none',
      color: {
        static: {
          initial: 'inherit',
          dark: 'inherit'
        },
        hover: {
          initial: '{typography.color.primary.500}',
          dark: '{typography.color.primary.400}'
        }
      },
      border: {
        width: '1px',
        style: {
          static: 'dashed',
          hover: 'solid'
        },
        color: {
          static: {
            initial: 'currentColor',
            dark: 'currentColor'
          },
          hover: {
            initial: 'currentColor',
            dark: 'currentColor'
          }
        },
        distance: '2px'
      },
      fontWeight: '{typography.fontWeight.medium}',
      hasCode: {
        borderBottom: 'none'
      },
      code: {
        border: {
          width: '{prose.a.border.width}',
          style: '{prose.a.border.style.static}',
          color: {
            static: {
              initial: '{typography.color.secondary.400}',
              dark: '{typography.color.secondary.600}'
            },
            hover: {
              initial: '{typography.color.primary.500}',
              dark: '{typography.color.primary.600}'
            }
          }
        },
        color: {
          static: {
            initial: 'currentColor',
            dark: 'currentColor'
          },
          hover: {
            initial: 'currentColor',
            dark: 'currentColor'
          }
        },
        background: {
          static: {},
          hover: {
            initial: '{typography.color.primary.50}',
            dark: '{typography.color.primary.900}'
          }
        }
      }
    },
    blockquote: {
      margin: '{typography.verticalMargin.base} 0',
      paddingInlineStart: '24px',
      quotes: "'201C' '201D' '2018' '2019'",
      color: {
        initial: '{typography.color.secondary.500}',
        dark: '{typography.color.secondary.400}'
      },
      border: {
        width: '4px',
        style: 'solid',
        color: {
          initial: '{typography.color.secondary.200}',
          dark: '{typography.color.secondary.700}'
        }
      }
    },
    ul: {
      listStyleType: 'disc',
      margin: '{typography.verticalMargin.base} 0',
      paddingInlineStart: '21px',
      li: {
        markerColor: {
          initial: 'currentColor',
          dark: 'currentColor'
        }
      }
    },
    ol: {
      listStyleType: 'decimal',
      margin: '{typography.verticalMargin.base} 0',
      paddingInlineStart: '21px',
      li: {
        markerColor: {
          initial: 'currentColor',
          dark: 'currentColor'
        }
      }
    },
    li: {
      margin: '{typography.verticalMargin.sm} 0',
      listStylePosition: 'outside'
    },
    hr: {
      margin: '{typography.verticalMargin.base} 0',
      style: 'solid',
      width: '1px',
      color: {
        initial: '{typography.color.secondary.200}',
        dark: '{typography.color.secondary.800}'
      }
    },
    table: {
      margin: '{typography.verticalMargin.base} 0',
      textAlign: 'start',
      fontSize: '{typography.fontSize.sm}',
      lineHeight: '{typography.lead.6}'
    },
    thead: {
      border: {
        width: '0px',
        style: 'solid',
        color: {
          initial: '{typography.color.secondary.300}',
          dark: '{typography.color.secondary.600}'
        }
      },
      borderBottom: {
        width: '1px',
        style: 'solid',
        color: {
          initial: '{typography.color.secondary.200}',
          dark: '{typography.color.secondary.800}'
        }
      }
    },
    th: {
      color: {
        initial: '{typography.color.secondary.600}',
        dark: '{typography.color.secondary.400}'
      },
      padding: '0 {typography.verticalMargin.sm} {typography.verticalMargin.sm} {typography.verticalMargin.sm}',
      fontWeight: '{typography.fontWeight.semibold}',
      textAlign: 'inherit'
    },
    tbody: {
      tr: {
        borderBottom: {
          width: '1px',
          style: 'dashed',
          color: {
            initial: '{typography.color.secondary.200}',
            dark: '{typography.color.secondary.800}'
          }
        }
      },
      td: {
        padding: '{typography.verticalMargin.sm}'
      },
      code: {
        inline: {
          fontSize: '{typography.fontSize.sm}'
        }
      }
    },
    code: {
      block: {
        fontSize: '{typography.fontSize.sm}',
        margin: '{typography.verticalMargin.base} 0',
        border: {
          width: '1px',
          style: 'solid',
          color: {
            initial: '{typography.color.secondary.200}',
            dark: '{typography.color.secondary.800}'
          }
        },
        color: {
          initial: '{typography.color.secondary.700}',
          dark: '{typography.color.secondary.200}'
        },
        backgroundColor: {
          initial: '{typography.color.secondary.100}',
          dark: '{typography.color.secondary.900}'
        },
        backdropFilter: {
          initial: 'contrast(1)',
          dark: 'contrast(1)'
        },
        pre: {
          padding: '{typography.verticalMargin.sm}'
        }
      },
      inline: {
        borderRadius: '{radii.xs}',
        padding: '0.2rem 0.375rem 0.2rem 0.375rem',
        fontSize: '{typography.fontSize.sm}',
        fontWeight: '{typography.fontWeight.normal}',
        color: {
          initial: '{typography.color.secondary.700}',
          dark: '{typography.color.secondary.200}'
        },
        backgroundColor: {
          initial: '{typography.color.secondary.100}',
          dark: '{typography.color.secondary.800}'
        }
      }
    }
  },
  /**
   * Tokens import from @nuxt-themes/tokens.
   *
   * This is made for this package not to depend on @nuxt-themes/tokens globally.
   *
   * If used with @nuxt-themes/tokens, you don't need to change anything, these tokens will be merged with it.
   */
  color: {
    $schema: {
      title: 'Your website color palette.',
      tags: [
        '@studioInput design-token',
        '@studioInputTokenType color',
        '@studioIcon ph:palette'
      ]
    },
    white: '#ffffff',
    black: '#0c0c0d',
    primary: {
      50: '#d9e5ff',
      100: '#b3cbff',
      200: '#8db0ff',
      300: '#6696ff',
      400: '#407cff',
      500: '#1a62ff',
      600: '#0047e1',
      700: '#0035a9',
      800: '#002370',
      900: '#001238'
    },
    secondary: {
      50: '{color.gray.50}',
      100: '{color.gray.100}',
      200: '{color.gray.200}',
      300: '{color.gray.300}',
      400: '{color.gray.400}',
      500: '{color.gray.500}',
      600: '{color.gray.600}',
      700: '{color.gray.700}',
      800: '{color.gray.800}',
      900: '{color.gray.900}'
    },
    gray: {
      50: '#fafafa',
      100: '#f4f4f5',
      200: '#e4e4e7',
      300: '#D4d4d8',
      400: '#a1a1aa',
      500: '#71717A',
      600: '#52525B',
      700: '#3f3f46',
      800: '#27272A',
      900: '#18181B'
    }
  },
  radii: {
    $schema: {
      title: 'Your website border radiuses.',
      tags: [
        '@studioInput design-token',
        '@studioInpuTokenType size',
        '@studioIcon material-symbols:rounded-corner'
      ]
    },
    none: '0px',
    '2xs': '0.125rem',
    xs: '0.25rem',
    sm: '0.375rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    '2xl': '1.5rem',
    '3xl': '1.75rem',
    full: '9999px'
  },
  fontSize: {
    $schema: {
      title: 'Your website font sizes.',
      tags: [
        '@studioInput design-token',
        '@studioInputTokenType font-size',
        '@studioIcon radix-icons:font-style'
      ]
    },
    xs: {
      value: '0.75rem'
    },
    sm: {
      value: '0.875rem'
    },
    base: {
      value: '1rem'
    },
    lg: {
      value: '1.125rem'
    },
    xl: {
      value: '1.25rem'
    }
  },
  lead: {
    $schema: {
      title: 'Your website line heights.',
      tags: [
        '@studioInput design-token',
        '@studioInputTokenType size',
        '@studioIcon icon-park-outline:auto-line-height'
      ]
    },
    none: {
      value: '1'
    },
    tight: {
      value: '1.25'
    },
    snug: {
      value: '1.375'
    },
    normal: {
      value: '1.5'
    },
    relaxed: {
      value: '1.625'
    },
    loose: {
      value: '2'
    }
  },
  font: {
    $schema: {
      title: 'Your website fonts',
      tags: [
        '@studioInput design-token',
        '@studioInputTokenType font',
        '@studioIcon material-symbols:font-download-rounded'
      ]
    },
    sans: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji',
    serif: 'ui-serif, Georgia, Cambria, Times New Roman, Times, serif',
    mono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, Courier New, monospace'
  },
  /**
   * Using Elements tokens convention.
   */
  elements: {
    surface: {
      primary: {
        backgroundColor: {
          initial: '{color.gray.100}',
          dark: '{color.gray.900}'
        }
      },
      secondary: {
        backgroundColor: {
          initial: '{color.gray.200}',
          dark: '{color.gray.800}'
        }
      }
    }
  }
})
