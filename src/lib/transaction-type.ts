export const types: { [key: string]: string } = {
  '0': 'NODE',
  '1': 'NYM',
  '3': 'GET_TXN',
  '4': 'TXN_AUTHOR_AGREEMENT',
  '5': 'TXN_AUTHOR_AGREEMENT_AML',
  '100': 'ATTRIB',
  '101': 'SCHEMA',
  '102': 'CLAIM_DEF',
  '104': 'GET_ATTR',
  '105': 'GET_NYM',
  '107': 'GET_SCHEMA',
  '108': 'GET_CRED_DEF',
  '109': 'POOL_UPGRADE',
  '110': 'NODE_UPGRADE',
  '111': 'POOL_CONFIG',
  '113': 'REVOC_REG_DEF',
  '114': 'REVOC_REG_DEF',
  '120': 'AUTH_RULE',
  '122': 'AUTH_RULES'
};

export function getTypeNumber(description: string): string {
  const toReturn: string = Object.keys(types).find(prop => types[prop] === description) || '';

  if (toReturn === '') {
    throw new Error('Transaction description not found.');
  }

  return toReturn;
}
