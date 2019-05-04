
import { NextComponentType, NextContext } from 'next'
import * as React from 'react'

import FlashMessages from './FlashMessages'

export interface FlashMessagesProps {
  flashMessages: FlashMessages
}

export interface FlashMessagesContext extends NextContext {
  flashMessages: FlashMessages
}

/**
 * Expose `flashMessages` instance on `NextContext`.
 */
export function withFlashMessages<P extends FlashMessagesProps, IP>(
  ComposedComponent: NextComponentType<P, IP | undefined>
): NextComponentType<P, IP | undefined> {

  const name: string = ComposedComponent.displayName || ComposedComponent.name

  class WithFlashMessagesWrapper extends React.Component<P> {
    static displayName = `withFlashMessage(${name})`

    static getInitialProps?: any

    public render(): JSX.Element {
      const flashMessages = new FlashMessages()

      return (
        <ComposedComponent
          flashMessages={flashMessages}
          {...this.props as P} />
      )
    }
  }

  WithFlashMessagesWrapper.getInitialProps = async (ctx: FlashMessagesContext) => {
    let initialProps = {}

    if (ComposedComponent.getInitialProps) {
      ctx.flashMessages = new FlashMessages(ctx)

      initialProps = await ComposedComponent.getInitialProps(ctx)

      if (ctx.flashMessages) {
        delete ctx.flashMessages
      }
    }

    return initialProps
  }

  return WithFlashMessagesWrapper
}
