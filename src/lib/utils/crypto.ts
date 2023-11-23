
// import 'server-only'

import { env } from '@/config/env';
import { createCipheriv, createDecipheriv, createHash, randomBytes } from 'crypto';
import { randomNumber, shuffleStr } from '.';

export const CipherKeySymbol = Symbol('CryptoKey')
export type CipherKey = string & { [CipherKeySymbol]: true }

export const ALGORITHM = Object.freeze({
  AES_256_GCM: 'aes-256-gcm',
})

export function createKey(secret = env.SECRET_KEY) {
  return createHash('sha256').update(secret).digest('hex').slice(0, 32) as CipherKey
}

export function aes256gcm(key: CipherKey) {
  const algo = ALGORITHM.AES_256_GCM;

  const encrypt = (str: string) => {
    const iv = (() => {
      // generate iv based on timestamp and random bytes
      // timestamp is used to make sure that the iv is unique and then shuffled to make it unpredictable
      const timestamp = Buffer.from(shuffleStr(String(Date.now()).slice(randomNumber(8, 12) * -1)), 'utf8')
      const random = randomBytes(12)
      return Buffer.concat([timestamp, random]).toString('hex')
    })()

    const cipher = createCipheriv(algo, key, iv)

    let enc = cipher.update(str, 'utf8', 'hex')
    enc += cipher.final('hex')

    return `${enc}|${iv}|${cipher.getAuthTag().toString('hex')}` as const
  }

  const decrypt = (enc: `${string}|${string}|${string}` | {
    encStr: string,
    iv: string,
    authTag: string,
  }) => {
    const { encStr, iv, authTag } = typeof enc === 'string' ? ((s: string[]) => ({
      encStr: s[0],
      iv: s[1],
      authTag: s[2],
    }))(enc.split('|')) : enc

    const decipher = createDecipheriv(algo, key, iv)
    decipher.setAuthTag(Buffer.from(authTag, 'hex'))

    let str = decipher.update(encStr, 'hex', 'utf8')
    str += decipher.final('utf8')

    return str
  }

  const isValidToken = (enc: string): enc is `${string}|${string}|${string}` => {
    return enc.split('|').length === 3
  }

  return { encrypt, decrypt, isValidToken }
}