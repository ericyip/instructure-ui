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

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

import IconArrowOpenUp from '@instructure/ui-icons/lib/Line/IconArrowOpenUp'
import IconArrowOpenDown from '@instructure/ui-icons/lib/Line/IconArrowOpenDown'

import Locale from '@instructure/ui-i18n/lib/Locale'
import Decimal from '@instructure/ui-i18n/lib/Decimal'

import { pickProps, omitProps } from '@instructure/ui-utils/lib/react/passthroughProps'
import CustomPropTypes from '@instructure/ui-utils/lib/react/CustomPropTypes'
import deepEqual from '@instructure/ui-utils/lib/deepEqual'
import isActiveElement from '@instructure/ui-utils/lib/dom/isActiveElement'
import generateElementId from '@instructure/ui-utils/lib/dom/generateElementId'

import themeable from '@instructure/ui-themeable'

import styles from './styles.css'
import theme from './theme'

import FormPropTypes from '../../utils/FormPropTypes'
import FormField from '../FormField'

const keyDirections = {
  ArrowUp: 1,
  ArrowDown: -1
}

/**
---
category: components/forms
---
**/
@themeable(theme, styles)
class NumberInput extends Component {
  static propTypes = {
    label: PropTypes.node.isRequired,
    id: PropTypes.string,
    showArrows: PropTypes.bool,
    step: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    min: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    max: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    /**
     * Specify the number of digits to display after the decimal separator. If
     * the input has more digits after the decimal separator, it will be
     * rounded on blur. If it has less, trailing zeros will be added on blur.
     *
     * Pass either decimalPrecision or significantDigits, not both.
     */
    decimalPrecision: CustomPropTypes.xor(PropTypes.number, 'significantDigits'),
    /**
     * Specify the number of significant digits. If the input has more
     * significant digits, it will be rounded on blur. If it has less, traling
     * zeros will be added on blur.
     *
     * Pass either decimalPrecision or significantDigits, not both.
     */
    significantDigits: CustomPropTypes.xor(PropTypes.number, 'decimalPrecision'),
    /**
    * object with shape: `{
    * text: PropTypes.string,
    * type: PropTypes.oneOf(['error', 'hint', 'success', 'screenreader-only'])
    *   }`
    */
    messages: PropTypes.arrayOf(FormPropTypes.message),
    /**
      A standard language id
    **/
    locale: PropTypes.string,
    size: PropTypes.oneOf(['medium', 'large']),
    layout: PropTypes.oneOf(['stacked', 'inline']),
    width: PropTypes.string,
    inline: PropTypes.bool,
    /**
    * Html placeholder text to display when the input has no value. This should be hint text, not a label
    * replacement.
    */
    placeholder: PropTypes.string,
    /**
     * Whether or not to disable the input
     */
    disabled: PropTypes.bool,
    /**
     * Works just like disabled but keeps the same styles as if it were active
     */
    readOnly: PropTypes.bool,
    required: PropTypes.bool,
    /**
    * a function that provides a reference to the actual input element
    */
    inputRef: PropTypes.func,
    /**
    * value to set on initial render
    */
    defaultValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    /**
    * The selected value (must be accompanied by an `onChange` prop). If this
    * is a number, it will be formatted according to the current locale. If a
    * string is given, it should already be in the correct format for the
    * current locale.
    */
    value: CustomPropTypes.controllable(
      PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    ),
    /**
    * Called whenever the value of the input changes. The second argument is
    * the string value of the input; the third argument is a normalized string
    * value obtained by parsing the input string according to the current
    * locale, removing thousands separators, using the period `.` as decimal
    * separator, and rounding to the specified precision. This third argument
    * is `null` if the input value cannot be parsed.
    *
    * `onChange` is called on blur, as the value is formatted when the
    * component loses focus. In this case, `onChange` is always called *before*
    * `onBlur`.
    */
    onChange: PropTypes.func,
    onKeyDown: PropTypes.func,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func
  }

  static contextTypes = {
    locale: PropTypes.string
  }

  static defaultProps = {
    showArrows: true,
    step: 1,
    min: null,
    max: null,
    inline: false,
    size: 'medium',
    messages: [],
    disabled: false,
    readOnly: false,
    layout: 'stacked',
    inputRef: function (input) {},
    onChange: function (event, value, normalizedValue) {},
    onKeyDown: function (event) {},
    onFocus: function (event) {},
    onBlur: function (event) {}
  }

  constructor (props) {
    super()
    this._defaultId = generateElementId('NumberInput')
  }

  _input = null

  state = {
    focus: false
  }

  componentWillReceiveProps (nextProps, nextContext) {
    if (!this._input.value) return

    // If the locale or precision props change, update the input value accordingly
    const currentLocale = this.getLocale(this.props, this.context)
    const nextLocale = this.getLocale(nextProps, nextContext)
    const currentPrecision = this.getPrecision(this.props)
    const nextPrecision = this.getPrecision(nextProps)
    if (currentLocale === nextLocale && deepEqual(currentPrecision, nextPrecision)) return

    const decimalValue = Decimal.parse(this._input.value, currentLocale)
    if (decimalValue.isNaN()) return

    const formattedString = this.formatValue(decimalValue, nextLocale, nextPrecision)
    this._input.value = formattedString
    nextProps.onChange(null, formattedString, this.normalizeValue(decimalValue, nextPrecision))
  }

  // Replicate the arrow behavior commonly seen in inputs of type number
  applyStep = (dir) => {
    let d = Decimal.parse(this._input.value || '0', this.locale)

    if (!d.mod(this.step).equals(0)) {
      // case when value is between steps, so we snap to the next step
      const steps = d.div(this.step)

      if (dir > 0) {
        d = steps.floor().times(this.step)
      } else {
        d = steps.ceil().times(this.step)
      }
    }

    // then we add the step
    if (dir > 0) {
      d = d.plus(this.step)
    } else {
      d = d.minus(this.step)
    }

    // case when value is less than minimum
    if (this.min && d.lt(this.min)) {
      return this.min
    }

    // case when value is more than maximum
    if (this.max && d.gt(this.max)) {
      return this.max
    }

    return d
  }

  focus () {
    this._input.focus()
  }

  getLocale (props, context) {
    return props.locale || context.locale || Locale.browserLocale()
  }

  getPrecision (props) {
    return pickProps(props, {}, ['decimalPrecision', 'significantDigits'])
  }

  get min () {
    return this.props.min && Decimal.parse(this.props.min, Locale.defaultLocale)
  }

  get max () {
    return this.props.max && Decimal.parse(this.props.max, Locale.defaultLocale)
  }

  get step () {
    return this.props.step && Decimal.parse(this.props.step, Locale.defaultLocale)
  }

  get defaultValue () {
    const { defaultValue } = this.props
    if (defaultValue == null) return defaultValue

    // If defaultValue is a string, parse it as an en-US number
    const decimalValue = Decimal.parse(defaultValue, Locale.defaultLocale)

    // If it can be parsed as a number, format it according to the current
    // locale. Otherwise just return it as-is
    return decimalValue.isNaN() ? defaultValue : this.formatValue(decimalValue, this.locale)
  }

  get locale () {
    return this.getLocale(this.props, this.context)
  }

  get precision () {
    return this.getPrecision(this.props)
  }

  get invalid () {
    return (
      this.props.messages &&
      this.props.messages.findIndex((message) => message.type === 'error') >= 0
    )
  }

  get id () {
    return this.props.id || this._defaultId
  }

  get focused () {
    return isActiveElement(this._input)
  }

  getDecimalValue (value) {
    return Decimal.parse(value, this.locale)
  }

  get value () {
    return this._input.value
  }

  isControlled () {
    return typeof this.props.value !== 'undefined'
  }

  shouldFormatValueOnRender () {
    return this.isControlled() && typeof this.props.value === 'number' || this.props.value instanceof Number
  }

  conditionalFormat (value) {
    return this.shouldFormatValueOnRender()
      ? this.formatValue(this.getDecimalValue(value), this.locale)
      : value
  }

  formatValue (decimal, locale, precision = this.precision) {
    const { decimalPrecision, significantDigits } = precision
    if (decimalPrecision) return decimal.toFixed(decimalPrecision, locale)
    if (significantDigits) return decimal.toPrecision(significantDigits, locale)
    return locale ? decimal.toLocaleString(locale) : decimal.toString()
  }

  normalizeValue (decimal, precision = this.precision) {
    if (decimal.isNaN()) return null
    let value = decimal
    if (this.min && value.lt(this.min)) value = this.min
    if (this.max && value.gt(this.max)) value = this.max
    return this.formatValue(value, void 0, precision)
  }

  handleRef = (element, ...args) => {
    this._input = element
    this.props.inputRef.apply(this, [element].concat(args))
  }

  handleFocus = (event) => {
    this.setState({ focus: true })
    this.props.onFocus(event)
  }

  handleBlur = (event) => {
    let decimalValue = this.getDecimalValue(event.target.value)

    // case when value is less than minimum
    if (this.min && decimalValue.lt(this.min)) {
      decimalValue = this.min
    }

    // case when value is more than maximum
    if (this.max && decimalValue.gt(this.max)) {
      decimalValue = this.max
    }

    const formattedString = decimalValue.isNaN()
      ? this._input.value
      : this.formatValue(decimalValue, this.locale)
    if (!this.isControlled()) this._input.value = formattedString

    this.setState({ focus: false })

    this.props.onChange(event, formattedString, this.normalizeValue(decimalValue))
    this.props.onBlur(event)
  }

  handleChange = (event) => {
    const decimalValue = this.getDecimalValue(event.target.value)
    this.props.onChange(event, event.target.value, this.normalizeValue(decimalValue))
  }

  handleKeyDown = (event) => {
    this.props.onKeyDown(event)

    const dir = keyDirections[event.key]
    if (!dir) return

    event.preventDefault()
    this.handleStep(dir)
  }

  handleClickUp = (event) => {
    event.preventDefault()
    this.handleStep(1)
    this.focus()
  }

  handleClickDown = (event) => {
    event.preventDefault()
    this.handleStep(-1)
    this.focus()
  }

  handleStep (step) {
    if (this.props.disabled || this.props.readOnly) return

    const decimalValue = this.applyStep(step)
    if (!decimalValue.isNaN()) {
      const formattedString = decimalValue.toLocaleString(this.locale)
      if (!this.isControlled()) this._input.value = formattedString
      this.props.onChange(event, formattedString, this.normalizeValue(decimalValue))
    }
  }

  renderArrows () {
    return (
      <span className={styles.arrowContainer}>
        <span
          className={styles.arrow}
          onMouseDown={this.handleClickUp}
          role="presentation"
        >
          <IconArrowOpenUp />
        </span>
        <span
          className={styles.arrow}
          onMouseDown={this.handleClickDown}
          role="presentation"
        >
          <IconArrowOpenDown />
        </span>
      </span>
    )
  }

  render () {
    const {
      size,
      showArrows,
      placeholder,
      value,
      disabled,
      readOnly,
      required,
      width,
      inline
    } = this.props

    return (
      <FormField
        {...pickProps(this.props, FormField.propTypes)}
        id={this.id}
      >
        <span
          className={classnames(styles.inputContainer, {
            [styles.invalid]: this.invalid,
            [styles.disabled]: disabled,
            [styles[size]]: size,
            [styles.focus]: this.state.focus,
            [styles.inline]: inline
          })}
          style={width ? { width } : null}
        >
          <input
            {...omitProps(this.props, NumberInput.propTypes)}
            className={styles.input}
            onChange={this.handleChange}
            onKeyDown={this.handleKeyDown}
            onFocus={this.handleFocus}
            onBlur={this.handleBlur}
            type="text"
            inputMode="numeric"
            value={this.conditionalFormat(value)}
            defaultValue={this.defaultValue}
            placeholder={placeholder}
            ref={this.handleRef}
            id={this.id}
            required={required}
            aria-required={required}
            aria-invalid={this.invalid ? 'true' : null}
            disabled={disabled || readOnly}
            aria-disabled={disabled || readOnly ? 'true' : null}
          />
          {showArrows ? this.renderArrows() : null}
        </span>
      </FormField>
    )
  }
}

export default NumberInput
