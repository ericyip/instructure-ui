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

import { darken } from '@instructure/ui-themeable/lib/utils/color'

export default function generator ({ colors, typography, borders, spacing }) {
  return {
    fontFamily: typography.fontFamily,
    fontWeight: typography.fontWeightNormal,
    color: colors.textBrand,
    textDecoration: 'none',
    hoverColor: darken(colors.textBrand, 10),
    hoverTextDecoration: 'underline',
    outlineWidth: borders.widthSmall,
    outlineColor: 'transparent',
    outlineStyle: borders.style,
    outlineOffset: spacing.xxxSmall,
    focusOutlineColor: 'transparent',
    focusIconOutlineColor: colors.textBrand,

    colorInverse: colors.textLight,
    focusInverseOutlineColor: 'transparent',
    focusInverseIconOutlineColor: colors.textLight,

    iconPlusTextMargin: spacing.xxSmall
  }
}

generator['canvas-a11y'] = generator['canvas-high-contrast'] = function ({ colors }) {
  return {
    textDecoration: 'underline',
    focusOutlineColor: colors.borderBrand,
    focusInverseOutlineColor: colors.borderLight
  }
}

generator['canvas'] = function (variables) {
  return {
    color: variables['ic-link-color'],
    hoverColor: darken(variables['ic-link-color'], 10)
  }
}
