const micro = require('micro')
const got = require('got')
const utility = require('util')
const chai = require('chai')
const nock = require('nock')
const service = require('../services/exposed-keys')

const expect = chai.expect
const exposedKeysPort = 5001
const codesPort = 5002
const exposedKeysUrl = `http://localhost:${exposedKeysPort}`
const codesUrl = `http://localhost:${codesPort}`

function waitForListen (server) {
  return new Promise((resolve, reject) => {
    server.once('listening', _ => resolve())
  })
}

describe('dp3t:exposed-keys', () => {
  const request = got.extend({
    prefixUrl: exposedKeysUrl,
    responseType: 'json',
    resolveBodyOnly: true
  })
  let server

  it('start the service', async () => {
    server = micro(service)
    await waitForListen(server.listen(exposedKeysPort))
  })
  
  it('declare exposed key', async () => {
    // Mock code service
    nock(codesUrl)
    .post('/use-code')
    .reply(200, {})

    const response = await request('exposed', {
      method: 'POST',
      json: {
        key: 'QUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVpBQkNERUY=',
        onset: '2020-04-10',
        authData: {
          type: 'qrcode',
          code: 'fb604540-9f1f-4c9b-b51b-6b69bbd4ed62'
        }
      }
    })
  })
  // Let enough time to process
  .timeout(5000)
  
  it('get exposed keys for date', async () => {
    const response = await request('exposed/2020-04-10', { method: 'GET' })
    expect(response).to.deep.equal([{
      key: 'QUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVpBQkNERUY=',
      onset: '2020-04-10'
    }])
  })
  // Let enough time to process
  .timeout(5000)
  
  // Cleanup
  after(async () => {
    await server.close()
  })
})
