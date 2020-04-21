const micro = require('micro')
const http = require('http')
const got = require('got')
const chai = require('chai')
const service = require('../services/codes')

const expect = chai.expect

function waitForListen (server) {
  return new Promise((resolve, reject) => {
    server.once('listening', _ => resolve())
  })
}

describe('dp3t:codes', () => {
  const port = 3000
  const prefixUrl = `http://localhost:${port}`
  const request = got.extend({ prefixUrl, responseType: 'json' })
  let server

  it('start the service', async () => {
    server = new http.Server(micro(service))
    await waitForListen(server.listen(port))
  })
  /*
  it('create code', async () => {
    const response = await request('create-code', {
      method: 'POST',
      json: {
        emitter: 'doctor',
        type: 'qrcode'
      }
    })
    expect(response.type).to.equal('qrcode'})
    expect(response.code).to.exist
  })
  */
  // Cleanup
  after(async () => {
    await server.close()
  })
})
