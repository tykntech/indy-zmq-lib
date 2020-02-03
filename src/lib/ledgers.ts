export const ledgers: { [key: string]: string } = {
  '0': 'POOL',
  '1': 'DOMAIN',
  '2': 'CONFIG'
};

export function getLedgerNumber(ledger: string): string {
  const toReturn: string = Object.keys(ledgers).find(prop => ledgers[prop] === ledger) || '';

  if (!toReturn || toReturn === '') {
    throw new Error(`Ledger not found: '${ledger}'`);
  }

  return toReturn;
}
