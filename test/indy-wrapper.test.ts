import { Wrap, ParseGenesisTx } from './../src/index'
import { mockzmq, zeromq } from './__mocks__/zeromq'
import { mocksodium, sodium } from './__mocks__/libsodium-wrappers'

const mockedzmq = mockzmq as jest.Mocked<typeof zeromq>
const mockedsodium = mocksodium as jest.Mocked<typeof sodium>

// builderNet,  first line from: https://raw.githubusercontent.com/sovrin-foundation/sovrin/master/sovrin/pool_transactions_builder_genesis
const conf =
  '{"reqSignature":{},"txn":{"data":{"data":{"alias":"Node1","blskey":"4N8aUNHSgjQVgkpm8nhNEfDf6txHznoYREg9kirmJrkivgL4oSEimFF6nsQ6M41QvhM2Z33nves5vfSn9n1UwNFJBYtWVnHYMATn76vLuL3zU88KyeAYcHfsih3He6UHcXDxcaecHVz6jhCYz1P2UZn2bDVruL5wXpehgBfBaLKm3Ba","blskey_pop":"RahHYiCvoNCtPTrVtP7nMC5eTYrsUA8WjXbdhNc8debh1agE9bGiJxWBXYNFbnJXoXhWFMvyqhqhRoq737YQemH5ik9oL7R4NTTCz2LEZhkgLJzB3QRQqJyBNyv7acbdHrAT8nQ9UkLbaVL9NBpnWXBTw4LEMePaSHEw66RzPNdAX1","client_ip":"127.0.0.1","client_port":9702,"node_ip":"127.0.0.1","node_port":9701,"services":["VALIDATOR"]},"dest":"Gw6pDLhcBcoQesN72qfotTgFa7cbuqZpkX3Xo6pLhPhv"},"metadata":{"from":"Th7MpTaRZVRYnPiabds81Y"},"type":"0"},"txnMetadata":{"seqNo":1,"txnId":"fea82e10e894419fe2bea7d96296a6d46f50f93f9eeda954ec461b2ed2950b62"},"ver":"1"}'

/**
 * Transaction types test
 */

test.only('should succeed', async () => {
  const wrap = Wrap(await ParseGenesisTx(conf, mockedsodium), mockedzmq)
  expect(
    await wrap.send({
      operation: {
        type: '3',
        ledgerId: 1,
        data: 225
      },
      identifier: 'LibindyDid211111111111',
      protocolVersion: 2
    })
  ).not.toEqual(expect.any(Error))

  expect(mockedzmq.send)
})
