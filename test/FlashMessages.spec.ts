
import { expect } from 'chai'
import { NextContext } from 'next'

import FlashMessages from '../src/FlashMessages'
import { FlashMessagesContext } from '../src/withFlashMessages'

describe('FlashMessages.ts', () => {

  it('works properly without passing anything to constructor', () => {
    global['__defineGetter__']('navigator', () => {
      return undefined
    })

    const fm = new FlashMessages()
    let getResult: any

    expect(fm.isServer).to.true
    expect(fm.has()).to.false
    getResult = fm.get()
    expect(getResult).to.be.an.instanceof(Array)
    expect(getResult).to.have.lengthOf(0)

    fm.set('test')
    expect(fm.has()).to.true
    getResult = fm.get()
    expect(getResult).to.be.an.instanceof(Array)
    expect(getResult).to.have.lengthOf(1)
    expect(getResult[0][0]).to.have.string('message')
    expect(getResult[0][1]).to.have.string('test')

    fm.clear()
  })

  it('works properly when passing FlashMessagesContext to constructor', () => {
    global['__defineGetter__']('navigator', () => {
      return undefined
    })

    const childFm = new FlashMessages()
    childFm.set('test value')

    const fmCtx = {
      flashMessages: childFm
    }

    const fm = new FlashMessages(fmCtx as FlashMessagesContext)
    let getResult: any

    expect(fm.isServer).to.true

    expect(fm.has()).to.true
    getResult = fm.get()
    expect(getResult).to.be.an.instanceof(Array)
    expect(getResult).to.have.lengthOf(1)

    expect(fm.has()).to.false
    getResult = fm.get()
    expect(getResult).to.be.an.instanceof(Array)
    expect(getResult).to.have.lengthOf(0)

    fm.set('test')
    expect(fm.has()).to.true
    getResult = fm.get()
    expect(getResult).to.be.an.instanceof(Array)
    expect(getResult).to.have.lengthOf(1)
    expect(getResult[0][0]).to.have.string('message')
    expect(getResult[0][1]).to.have.string('test')

    fm.clear()
  })

  it('works properly when passing NextContext to constructor', () => {
    global['__defineGetter__']('navigator', () => {
      return undefined
    })

    const childFm = new FlashMessages()
    childFm.set('test value')

    const nextCtx = {
      req: {
        headers: {
          cookie: childFm.cookies.get('next-flash-messages')
        }
      },
      res: {
        setHeader: (name: string, value: number | string | string[]) => {}
      }
    }

    const fm = new FlashMessages(nextCtx as NextContext)
    let getResult: any

    expect(fm.isServer).to.true

    expect(fm.has()).to.true
    getResult = fm.get()
    expect(getResult).to.be.an.instanceof(Array)
    expect(getResult).to.have.lengthOf(1)

    fm.set('test')
    expect(fm.has()).to.true
    getResult = fm.get()
    expect(getResult).to.be.an.instanceof(Array)
    expect(getResult).to.have.lengthOf(1)
    expect(getResult[0][0]).to.have.string('message')
    expect(getResult[0][1]).to.have.string('test')

    fm.clear()
  })

  it('works properly with navigator not undefined', () => {
    global['__defineGetter__']('navigator', () => {
      return {}
    })

    const fm = new FlashMessages()
    let getResult: any

    expect(fm.isServer).to.false
    expect(fm.has()).to.false
    getResult = fm.get()
    expect(getResult).to.be.an.instanceof(Array)
    expect(getResult).to.have.lengthOf(0)

    fm.set('test')
    expect(fm.has()).to.true
    getResult = fm.get()
    expect(getResult).to.be.an.instanceof(Array)
    expect(getResult).to.have.lengthOf(1)
    expect(getResult[0][0]).to.have.string('message')
    expect(getResult[0][1]).to.have.string('test')

    fm.clear()
  })
})
