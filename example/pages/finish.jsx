/* eslint-disable */

import Router from 'next/router'
import { withFlashMessages } from 'next-flash-messages'
import React from 'react'

class FinishPage extends React.Component {

  static async getInitialProps(ctx) {
    const messages = ctx.flashMessages.get('go-to-finish')

    if (messages.length === 0) {
      if (ctx.res) {
        ctx.res.writeHead(302, {
          Location: '/'
        })
        ctx.res.end()
      } else {
        Router.push('/')
      }
    }

    return { messages }
  }

  render() {
    const { messages } = this.props

    return (
      <div>
        { messages.length > 0 ? (
          <p><a onClick={ () => {
            Router.push('/')
          } }>{ messages[0][1] }</a></p>
        ) : null }
      </div>
    )
  }
}

export default withFlashMessages(FinishPage)
