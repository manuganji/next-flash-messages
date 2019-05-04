/* eslint new-cap: 0, no-unused-vars: 0, dot-notation: 0, import/no-unresolved: 0, no-lonely-if: 0 */

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

  constructor(ctxOrCookie?: FlashMessagesContext | NextContext | string) {
    if (typeof navigator !== 'undefined') {
      this.cookies = new universalCookie()
      this.isServer = false
    } else {
      this.isServer = true

      if (!ctxOrCookie) {
        this.cookies = new universalCookie()
      } else {
        if (typeof ctxOrCookie === 'string') {
          this.cookies = new universalCookie(ctxOrCookie as string)
        } else if (!!ctxOrCookie['flashMessages']) {
          this.cookies = (ctxOrCookie as FlashMessagesContext).flashMessages.cookies
        } else if (!!ctxOrCookie['req']) {
          this.ctx = (ctxOrCookie as NextContext)
          this.cookies = new universalCookie(this.ctx.req.headers.cookie)
        } else {
          this.cookies = new universalCookie()
        }
      }
    }
  }

  public has(category: string = 'message'): boolean {
    const flashes = this.cookies.get(COOKIE_KEY) || []

    const result: [FlashMessageType] = flashes.filter((flash: FlashMessageType) => flash[0] === category)

    return result.length > 0
  }

  /**
   * Get and remove flash messages by category.
   *
   * @param category  Category of flash messages to get.
   */
  public get(category: string = 'message'): [FlashMessageType] {
    const flashes = this.cookies.get(COOKIE_KEY) || []

    const result: [FlashMessageType] = flashes.filter((flash: FlashMessageType) => flash[0] === category)
    const rest: [FlashMessageType] = flashes.filter((flash: FlashMessageType) => flash[0] !== category)

    this.setCookie(rest)

    return result
  }

  /**
   * Flashes a message to the next request.
   *
   * @param message  The message to be flashed.
   * @param category  The category for the message.
   */
  public set(message: string, category: string = 'message'): void {
    const flashes: [FlashMessageType] = this.cookies.get(COOKIE_KEY) || []

    flashes.push([category, message])

    this.setCookie(flashes)
  }

  /**
   * Clear stored cookie data.
   */
  public clear(): void {
    this.cookies.remove(COOKIE_KEY)
  }

  // Private methods

  /**
   * @param flashes  Flash messages.
   */
  private setCookie(flashes: [FlashMessageType]): void {
    if (this.isServer && this.ctx) {
      this.ctx.res.setHeader(SET_COOKIE_HEADER_KEY, serialize(COOKIE_KEY, JSON.stringify(flashes)))
    } else {
      this.cookies.set(COOKIE_KEY, flashes)
    }
  }
}
