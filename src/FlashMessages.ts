
import { serialize } from 'cookie'
import { NextContext } from 'next'
import universalCookie from 'universal-cookie'

import { COOKIE_KEY, FlashMessageType } from './constants'
import { FlashMessagesContext } from './withFlashMessages'

const SET_COOKIE_HEADER_KEY: string = 'Set-Cookie'

export default class FlashMessages {

  public cookies: universalCookie

  public isServer: boolean

  private ctx?: NextContext

  constructor(ctx_or_cookie?: FlashMessagesContext | NextContext | string) {
    if (ctx_or_cookie || typeof ctx_or_cookie === 'string') {
      this.isServer = true
      if (typeof ctx_or_cookie === 'string') {
        this.cookies = new universalCookie(ctx_or_cookie)
      } else if (!!ctx_or_cookie['flashMessages']) {
        this.cookies = ctx_or_cookie['flashMessages'].cookies
      } else if (typeof ctx_or_cookie.req !== 'undefined') {
        this.cookies = new universalCookie(ctx_or_cookie.req.headers.cookie)
        this.ctx = ctx_or_cookie
      } else {
        this.cookies = new universalCookie()
      }
    } else if (typeof navigator !== 'undefined') {
      this.cookies = new universalCookie()
      this.isServer = false
    }
  }

  public has(category: string = 'message'): boolean {
    const flashes = this.cookies.get(COOKIE_KEY) || []

    const result: [FlashMessageType] = flashes.filter((flash: FlashMessageType) => {
      return flash[0] === category
    })

    return result.length > 0
  }

  /**
   * Get and remove flash messages by category.
   *
   * @param category  Category of flash messages to get.
   */
  public get(category: string = 'message'): [FlashMessageType] {
    const flashes = this.cookies.get(COOKIE_KEY) || []

    const result: [FlashMessageType] = flashes.filter((flash: FlashMessageType) => {
      return flash[0] === category
    })

    const rest: [FlashMessageType] = flashes.filter((flash: FlashMessageType) => {
      return flash[0] !== category
    })

    this.setCookie(rest)

    return result
  }

  /**
   * Flashes a message to the next request.
   *
   * @param message  The message to be flashed.
   * @param category  The category for the message.
   */
  public set(message: string, category: string = 'message') {
    const flashes: [FlashMessageType] = this.cookies.get(COOKIE_KEY) || []

    flashes.push([category, message])

    this.setCookie(flashes)
  }

  // Private methods

  /**
   * @param flashes  Flash messages.
   */
  private setCookie(flashes: [FlashMessageType]) {
    if (this.isServer && this.ctx) {
      this.ctx.res.setHeader(SET_COOKIE_HEADER_KEY, serialize(COOKIE_KEY, JSON.stringify(flashes)))
    } else {
      this.cookies.set(COOKIE_KEY, flashes)
    }
  }
}
