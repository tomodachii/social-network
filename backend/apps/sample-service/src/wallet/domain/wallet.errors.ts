import { Exception } from '@lib/common/exceptions';

export class WalletNotEnoughBalanceError extends Exception {
  static readonly message = 'WalletRecord has not enough balance';

  public readonly code = 'WALLET.NOT_ENOUGH_BALANCE';

  constructor(metadata?: unknown) {
    super(WalletNotEnoughBalanceError.message, undefined, metadata);
  }
}
