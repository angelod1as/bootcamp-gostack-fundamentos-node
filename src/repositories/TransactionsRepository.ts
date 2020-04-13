import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

class TransactionsRepository {
  private transactions: Transaction[];

  constructor() {
    this.transactions = [];
  }

  public all(): Transaction[] {
    return this.transactions;
  }

  public getBalance(): Balance {
    const income = this.transactions
      .filter(each => each.type === 'income')
      .reduce((acc, total) => {
        return acc + total.value;
      }, 0);

    const outcome = this.transactions
      .filter(each => each.type === 'outcome')
      .reduce((acc, total) => {
        return acc + total.value;
      }, 0);

    return {
      income,
      outcome,
      total: income - outcome,
    };
  }

  public create({ title, type, value }: Transaction): Transaction {
    const insufficientBalance =
      type === 'outcome' && this.getBalance().total < value;

    if (insufficientBalance) {
      throw Error('Insufficient money on account');
    }

    const transaction = new Transaction({ title, type, value });

    this.transactions.push(transaction);

    return transaction;
  }
}

export default TransactionsRepository;
