import { Wrap, ParseGenesisTx } from '../src/index';
import { mockzmq, zeromq } from './__mocks__/zeromq';
import { mocksodium, sodium } from './__mocks__/libsodium-wrappers';

const mockedzmq = mockzmq as jest.Mocked<typeof zeromq>;
const mockedsodium = mocksodium as jest.Mocked<typeof sodium>;

// builderNet,  first line from: https://raw.githubusercontent.com/sovrin-foundation/sovrin/master/sovrin/pool_transactions_builder_genesis
const conf =
  '{"reqSignature":{},"txn":{"data":{"data":{"alias":"FoundationBuilder","blskey":"3gmhmqpPLqznZF3g3niodaHjbpsB6TEeE9SpgXgBnZJLmXgeRzJqTLajVwbhxrkomJFTFU4ohDC4ZRXKbUPCQywJuPAQnst8XBtCFredMECn4Z3goi1mNt5QVRdU8Ue2xMSkdLpsQMjCsNwYUsBguwXYUQnDXQXnHqRkK9qrivucQ5Z","blskey_pop":"RHWacPhUNc9JWsGNdmWYHrAvvhsow399x3ttNKKLDpz9GkxxnTKxtiZqarkx4uP5ByTwF4kM8nZddFKWuzoKizVLttALQ2Sc2BNJfRzzUZMNeQSnESkKZ7U5vE2NhUDff6pjANczrrDAXd12AjSG61QADWdg8CVciZFYtEGmKepwzP","client_ip":"35.161.146.16","client_port":"9702","node_ip":"50.112.53.5","node_port":"9701","services":["VALIDATOR"]},"dest":"GVvdyd7Y6hsBEy5yDDHjqkXgH8zW34K74RsxUiUCZDCE"},"metadata":{"from":"V5qJo72nMeF7x3ci8Zv2WP"},"type":"0"},"txnMetadata":{"seqNo":1,"txnId":"fe991cd590fff10f596bb6fe2362229de47d49dd50748e38b96f368152be29c7"},"ver":"1"}';

/**
 * Transaction types test
 */

test('should succeed', async () => {
  const genfile = await ParseGenesisTx(conf, mockedsodium);
  expect(genfile);
});
