
import { NextComponentType, NextContext } from 'next'
import * as React from 'react'

import FlashMessages from './FlashMessages'

export interface FlashMessagesProps {
  cookieString: string,
  flashMessages: FlashMessages
}

export interface FlashMessagesContext extends NextContext {
  flashMessages: FlashMessages
}

export function withFlashMessages<P extends FlashMessagesProps, IP>(
  ComposedComponent: NextComponentType<P, IP | undefined>
): NextComponentType<P, IP | undefined> {

  const name: string = ComposedComponent.displayName || ComposedComponent.name

  let flashMessages: FlashMessages

  class WithFlashMessagesWrapper extends React.Component<P> {
    static displayName = `withFlashMessage(${name})`

    static getInitialProps?: any

    public render(): JSX.Element {
      if (!flashMessages) {
        const { cookieString } = this.props

        flashMessages = new FlashMessages(cookieString)
      }

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
    }

    if (ctx && ctx.req) {
      initialProps['cookieString'] = ctx.req.headers.cookie || ''
    }

    return initialProps
  }

  return WithFlashMessagesWrapper
}
