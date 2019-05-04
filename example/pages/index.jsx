/* eslint-disable */

import Router from 'next/router'
import { withFlashMessages } from 'next-flash-messages'
import React from 'react'

class IndexPage extends React.Component {

  render() {
    const { flashMessages } = this.props

    const message = flashMessages.get('index-messages')[0]
    let key, val
    if (message) {
      key = message[0]
      val = message[1]
    }

    return (
      <div>
        { message ? (
          <p>{`${key}: ${val}`}</p>
        ) : null }
        <a onClick={ () => {
          let num = message ? parseInt(val, 10) : 0
          num++
          flashMessages.set(`${num}`, 'index-messages')
          flashMessages.set('Go to finish', 'go-to-finish')
          Router.push('/finish')
        } }>Go to Finish page</a>
      </div>
    )
  }
}

export default withFlashMessages(IndexPage)
