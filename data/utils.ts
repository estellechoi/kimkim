import BigNumber from 'bignumber.js';

export const parseAmount = (value: bigint, decimals: number): BigNumber => {
  return new BigNumber(value.toString()).shiftedBy(-decimals);
};
