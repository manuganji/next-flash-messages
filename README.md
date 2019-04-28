# next-flash-messages

## Installation

```
$ npm install next-flash-messages
```

## Usage

```javascript
import React from 'react'
import { withFlashMessages } from 'next-flash-messages'

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
          flashMessages.set('test')
        } }>Set flash message</a>
      </div>
    )
  }
}

export default withFlashMessages(IndexPage)
```
