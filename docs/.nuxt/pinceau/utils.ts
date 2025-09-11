import { PinceauTheme, PropertyValue } from 'pinceau'

export const my = (value: PropertyValue<'margin'>) => {
  return {
    marginTop: value,
    marginBottom: value,
  }
}

export const mx = (value: PropertyValue<'margin'>) => {
  return {
    marginLeft: value,
    marginRight: value,
  }
}

export const py = (value: PropertyValue<'margin'>) => {
  return {
    paddingTop: value,
    paddingBottom: value,
  }
}

export const px = (value: PropertyValue<'margin'>) => {
  return {
    paddingLeft: value,
    paddingRight: value,
  }
}

export const truncate = {
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
} as any

export const lineClamp = (lines: number | string) => (({
  'overflow': 'hidden',
  'display': '-webkit-box',
  '-webkit-box-orient': 'vertical',
  '-webkit-line-clamp': lines
}) as any)

export const text = (size: keyof PinceauTheme['text']) => ({
  fontSize: `{text.${size}.fontSize}`,
  lineHeight: `{text.${size}.lineHeight}`,
})

export const stateColors = (value: any) => {
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

export const utils = { my, mx, py, px, truncate, lineClamp, text, stateColors }

export type GeneratedPinceauUtils = typeof utils

export default utils