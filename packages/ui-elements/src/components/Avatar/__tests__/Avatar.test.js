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

import React from 'react'
import View from '@instructure/ui-layout/lib/components/View'

import Avatar from '../index'

import styles from '../styles.css'

describe('<Avatar />', () => {
  const testbed = new Testbed(<Avatar name="Jessica Jones" />)

  describe('for a11y', () => {
    it('should meet standards', (done) => {
      const subject = testbed.render()

      subject.should.be.accessible(done)
    })

    it('should have aria-hidden=true', () => {
      const subject = testbed.render()

      expect(subject.find('[aria-hidden]')).to.be.present
    })
  })

  describe('with the default props', () => {
    it('should should display as a circle', () => {
      const subject = testbed.render()

      expect(subject.hasClass(styles.circle)).to.be.true
    })

    it('should render initials', () => {
      const subject = testbed.render()

      expect(subject.text())
        .to.equal('JJ')
    })
  })

  describe('when an image src url is provided', () => {
    it('should display the image url provided', () => {
      // eslint-disable-next-line max-len
      const src = 'data:image/gif;base64,R0lGODlhFAAUAJEAAP/9/fYQEPytrflWViH5BAAAAAAALAAAAAAUABQAQAJKhI+pGe09lnhBnEETfodatVHNh1BR+ZzH9LAOCYrVYpiAfWWJOxrC/5MASbyZT4d6AUIBlUYGoR1FsAXUuTN5YhxAEYbrpKRkQwEAOw=='

      const subject = testbed.render({ src })
      const image = Testbed.wrap(subject.instance()._image)

      image.dispatchNativeEvent('load')

      expect(subject.getComputedStyle().getPropertyValue('background-image'))
        .to.contain(src)
    })
  })

  describe('when variant is set to "rectangle"', () => {
    it('should display as a rectangle', () => {
      const subject = testbed.render({
        variant: 'rectangle'
      })

      expect(subject.hasClass(styles.rectangle)).to.be.true
    })
  })

  describe('when the user name has no spaces', () => {
    it('should render a single initial', () => {
      const subject = testbed.render({
        name: 'Jessica'
      })

      expect(subject.text()).to.equal('J')
    })
  })

  describe('when the user name has leading spaces', () => {
    it('should skip them', () => {
      const subject = testbed.render({
        name: ' Jessica Jones'
      })

      expect(subject.text()).to.equal('JJ')
    })
  })

  describe('when the user name is empty', () => {
    it('should render', () => {
      const subject = testbed.render({
        name: ''
      })

      expect(subject.text()).to.equal('')
    })
  })

  describe('when alt text is provided', () => {
    it('should render the text as an aria-label attribute', () => {
      const subject = testbed.render({alt: 'This is a test'})
      expect(subject.find('[aria-label]').getAttribute('aria-label')).to.equal('This is a test')
    })

    it('should set the role attribute to img', () => {
      const subject = testbed.render({alt: 'This is a test'})
      expect(subject.find('[role]').getAttribute('role')).to.equal('img')
    })
  })

  describe('when passing down props to View', () => {
    const allowedProps = {
      margin: 'small',
      elementRef: () => {},
      as: 'div',
      display: 'inline-block'
    }

    Object.keys(View.propTypes)
      .filter(prop => prop !== 'theme' && prop !== 'children')
      .forEach((prop) => {
        if (Object.keys(allowedProps).indexOf(prop) < 0) {
          it(`should NOT allow the '${prop}' prop`, () => {
            const subject = testbed.render({
              [prop]: 'foo'
            })
            expect(subject.find(View).props()[prop]).to.not.exist
          })
        } else {
          it(`should allow the '${prop}' prop`, () => {
            const subject = testbed.render({
              [prop]: allowedProps[prop]
            })
            expect(subject.find(View).props()[prop]).to.equal(allowedProps[prop])
          })
        }
    })

    it(`should set the 'display' prop based on the 'inline' prop`, () => {
      const subject = testbed.render({
        inline: true
      })
      expect(subject.find(View).props().display).to.equal('inline-block')
    })
  })
})
