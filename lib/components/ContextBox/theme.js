export default function ({ colors, borders, shadows }) {
  return {
    borderColor: colors.border,
    backgroundColor: colors.lightest,
    textColor: colors.dark,

    borderColorInverse: 'transparent',
    backgroundColorInverse: colors.dark,
    textColorInverse: colors.lightest,

    arrowSize: '0.5rem',
    borderWidth: borders.widthSmall,
    borderRadius: borders.radiusMedium,

    boxShadow: shadows.depth1
  }
}