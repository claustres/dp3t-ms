const Redis = require('ioredis')
const makeDebug = require('debug')

const debug = makeDebug('dp3t-ms:redis')

function createRedis(connectionString, options) {
	debug('Initializing redis', connectionString, options)
  const redisInstance = new Redis(connectionString, options)

  process.on('SIGINT', () => redisInstance.quit())
  process.on('SIGTERM', () => redisInstance.quit())
  process.on('exit', () => redisInstance.quit())

  return redisInstance
}

module.exports = {createRedis}
