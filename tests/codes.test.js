const micro = require('micro')
const got = require('got')
const chai = require('chai')
const service = require('../services/codes')

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

describe('dp3t:codes', () => {
  const request = got.extend({
    prefixUrl: codesUrl,
    responseType: 'json',
    resolveBodyOnly: true
  })
  let server

  it('start the service', async () => {
    server = micro(service)
    await waitForListen(server.listen(codesPort))
  })
  
  it('create qrcode for doctor', async () => {
    const response = await request('create-code', {
      method: 'POST',
      json: {
        emitter: 'doctor',
        type: 'qrcode'
      }
    })
    expect(response.type).to.equal('qrcode')
    expect(response.code).to.exist
  })
  // Let enough time to process
  .timeout(5000)
  
  // Cleanup
  after(async () => {
    await server.close()
  })
})
