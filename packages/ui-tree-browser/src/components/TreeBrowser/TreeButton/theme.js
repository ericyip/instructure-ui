/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 - present Instructure, Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

export default function generator ({ colors, spacing, typography, borders }) {
  return {
    hoverBackgroundColor: colors.brand,
    focusOutlineWidth: borders.widthMedium,
    focusOutlineColor: colors.brand,
    iconColor: colors.oxford,
    iconsMarginRight: spacing.xSmall,
    descriptorMarginTop: spacing.xxxSmall,
    nameTextColor: colors.brand,
    descriptorTextColor: colors.oxford,
    hoverTextColor: colors.white,
    nameFontSizeSmall: typography.fontSizeXSmall,
    nameFontSizeMedium: typography.fontSizeSmall,
    nameFontSizeLarge: typography.fontSizeMedium,
    descriptorFontSizeSmall: typography.fontSizeXSmall,
    descriptorFontSizeMedium: typography.fontSizeXSmall,
    descriptorFontSizeLarge: typography.fontSizeSmall,
    baseSpacingSmall: spacing.xSmall,
    baseSpacingMedium: spacing.small,
    baseSpacingLarge: '1rem',
    borderWidth: borders.widthSmall,
    borderColor: colors.ash,
    textLineHeight: typography.lineHeightCondensed
  }
}

generator['canvas'] = function (variables) {
  return {
    iconColor: variables['ic-brand-font-color-dark'],
    hoverBackgroundColor: variables['ic-brand-primary'],
    focusOutlineColor: variables['ic-brand-primary'],
    nameTextColor: variables['ic-brand-primary'],
    descriptorTextColor: variables['ic-brand-font-color-dark']
  }
}
