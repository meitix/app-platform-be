import { IInvoice } from '../../../user-directory';
import { TransactionStatus } from './transaction.status';
import { TransactionKeyGenerator } from './transaction-key-generator.model';

export interface ITransaction {
  status: TransactionStatus;
  transactionKey: string;
  invoice: IInvoice;
}

export class Transaction implements ITransaction {
  readonly transactionKey: string;
  constructor(public invoice: IInvoice, public status: TransactionStatus) {
    this.transactionKey = TransactionKeyGenerator.generate();
  }
}
