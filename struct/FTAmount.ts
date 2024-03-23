import BigNumber from 'bignumber.js';
import type { Coin } from '@cosmjs/stargate';
import { TokenSymbols } from '@/constants/app';

/**
 * 
 * @description fungible token amount structure
 */
class FTAmount {
  private coin: Coin;
  public priceOracle: number;
  public decimals: number;

  constructor(
    coin: Coin,
    decimals: number,
    priceOracle?: number,
  ) {
    this.coin = coin;
    this.decimals = decimals;
    this.priceOracle = priceOracle ?? 1;
  }

  public get unshifted(): BigNumber {
    return new BigNumber(this.coin.amount);
  }

  public get shifted(): BigNumber {
    return this.unshifted.shiftedBy(-this.decimals).dp(this.decimals);
  }

  public get usd(): BigNumber {
    return this.shifted.times(this.priceOracle);
  }

  public get symbol(): TokenSymbols | undefined {
    const parsedDenom = this.coin.denom.substring(1).toUpperCase();
    const knowmSymbol = Object.values(TokenSymbols).find((item) => item === parsedDenom as TokenSymbols);
    return knowmSymbol;
  }
}

export default FTAmount;
