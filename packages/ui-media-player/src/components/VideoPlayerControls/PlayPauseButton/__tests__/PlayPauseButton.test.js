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

import PlayPauseButton from '../index'
import { Provider } from '../../../VideoPlayer/VideoPlayerContext'
import {
  PAUSED,
  PLAYING,
  ENDED,
  WINDOWED_SCREEN
} from '../../../../constants'

describe('<PlayPauseButton />', () => {
  const providerState = {
    state: {
      videoState: PAUSED,
      screenState: WINDOWED_SCREEN,
      loadingSrc: false,
      showControls: false,
      videoId: 'uuid-123'
    },
    actions: {
      seek: () => {},
      showControls: () => {},
      togglePlay: () => {},
      toggleFullScreen: () => {}
    }
  }
  const testbed = new Testbed(
    <Provider value={providerState}>
      <PlayPauseButton />
    </Provider>
  )

  it('should render', () => {
    const component = testbed.render().find('VideoPlayerButton')
    expect(component).to.be.present
  })

  it('defaults to the paused variant', () => {
    expect(testbed.render().text()).to.match(/Play/)
  })

  it('passes down videoId prop to VideoPlayerButton', () => {
    const component = testbed.render().find('VideoPlayerButton')
    expect(component.prop('videoId')).to.be.eql('uuid-123')
  })

  it('passes down forwardRef prop to VideoPlayerButton', () => {
    const forwardRef = testbed.stub()
    const component = testbed.render({ children: <PlayPauseButton forwardRef={forwardRef} /> }).find('VideoPlayerButton')
    expect(component.prop('forwardRef')).to.have.been.called
  })

  it('invokes onClick prop when clicked', () => {
    const onClick = testbed.stub()
    const customProviderState = {
      ...providerState,
      actions: {
        ...providerState.actions,
        togglePlay: onClick
      }
    }
    const component = testbed.render({ value: customProviderState }).find('VideoPlayerButton')
    component.click()
    expect(onClick).to.have.been.called
  })

  describe('variants', () => {
    context('PAUSED', () => {
      it('renders a play button', () => {
        const customProviderState = {
          ...providerState,
          state: {
            ...providerState.state,
            videoState: PAUSED
          }
        }
        const component = testbed.render({ value: customProviderState }).find('VideoPlayerButton')
        expect(component.text()).to.match(/Play/)
        expect(component.find('IconPlay').length).to.eql(1)
      })
    })

    context('ENDED', () => {
      it('renders a play button', () => {
        const customProviderState = {
          ...providerState,
          state: {
            ...providerState.state,
            videoState: ENDED
          }
        }
        const component = testbed.render({ value: customProviderState })
        expect(component.text()).to.match(/Play/)
        expect(component.find('IconPlay').length).to.eql(1)
      })
    })

    context('PLAYING', () => {
      it('renders a pause button', () => {
        const customProviderState = {
          ...providerState,
          state: {
            ...providerState.state,
            videoState: PLAYING
          }
        }
        const component = testbed.render({ value: customProviderState })
        expect(component.text()).to.match(/Pause/)
        expect(component.find('IconPause').length).to.eql(1)
      })
    })
  })
})
