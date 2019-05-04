# next-flash-messages

One-time cookie-based flash messaging library for [next.js](https://nextjs.org/).

[![npm](https://nodei.co/npm/next-flash-messages.png?downloads=true&stars=true)](https://nodei.co/npm/next-flash-messages)

## Installation

```
$ npm install next-flash-messages
```

## Usage

The `next-flash-messages` allows you to temporarily store messages in one request and retrieve them for display in a subsequent request.  
This library stores flash message in the cookie.

```javascript
import React from 'react'
import { withFlashMessages } from 'next-flash-messages'

class IndexPage extends React.Component {

  render() {
    const { flashMessages } = this.props

    // To get all flashed messages by category.
    const messages = flashMessages.get('flash message category')

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
          // Set flash message with category.
          flashMessages.set('flash message strings.', 'flash message category')
        } }>Set flash message</a>
      </div>
    )
  }
}

export default withFlashMessages(IndexPage)
```

## License

`next-flash-messages` is licensed under MIT License.  
See [LICENSE](https://github.com/tokuda109/next-flash-messages/blob/master/LICENSE) for more information.
