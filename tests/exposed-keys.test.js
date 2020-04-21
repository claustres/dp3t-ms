const micro = require('micro')
const http = require('http')
const got = require('got')
const chai = require('chai')
const service = require('../services/exposed-keys')

const expect = chai.expect

function waitForListen (server) {
  return new Promise((resolve, reject) => {
    server.once('listening', _ => resolve())
  })
}

describe('dp3t:exposed-keys', () => {
  const port = 3000
  const prefixUrl = `http://localhost:${port}`
  const request = got.extend({ prefixUrl, responseType: 'json' })
  let server

  it('start the service', async () => {
    server = new http.Server(micro(service))
    await waitForListen(server.listen(port))
  })
  /*
  it('declare key', async () => {
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
    expect(response)
  })
  
  it('get keys', async () => {
    const response = await request('exposed/2020-04-10', { method: 'GET' })
    expect(response).to.deep.equal({
      key: 'QUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVpBQkNERUY=',
      onset: '2020-04-10'
    })
  })
  */
  // Cleanup
  after(async () => {
    await server.close()
  })
})
