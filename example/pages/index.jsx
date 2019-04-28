/* eslint-disable */

import Router from 'next/router'
import { withFlashMessages } from 'next-flash-messages'
import React from 'react'

class IndexPage extends React.Component {

  render() {
    const { flashMessages } = this.props

    const messages = flashMessages.get()

    return (
      <div>
        { (() => {
          let i = 0
          if (messages.length > 0) {
            return messages.map((message) => {
              i++
              return (<p key={`msg-${i}`}>{`${i}: ${message[1]}`}</p>)
            })
          } else {
            return null
          }
        })() }
        <a onClick={ () => {
          flashMessages.set('test', 'go-to-finish')
          Router.push('/finish')
        } }>Go to Finish page</a>
      </div>
    )
  }
}

export default withFlashMessages(IndexPage)
