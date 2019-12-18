'use strict'

import base58 = require('bs58')

const sodium = require('libsodium-wrappers')

const mocksodium: any = jest.genMockFromModule('libsodium-wrappers')

mocksodium.ready = async function(): Promise<any> {
  return true
}

mocksodium.crypto_sign_ed25519_pk_to_curve25519 = function(param1: any) {
  return base58.decode('HXrfcFWDjWusENBoXhV8mARzq51f1npWYWaA1GzfeMDG')
}

export { mocksodium, sodium }
