import { sleep } from "../utils/sleep";
import { BankAccount, BankAccountRepository } from "./BankAccountRepository";

export class MockBankAccountRepository implements BankAccountRepository {
  constructor() {}

  private bankAccountList: BankAccount[] = [
    {
      id: 1,
      balance: 20_000_000,
    },
    {
      id: 2,
      balance: 0,
    },
    {
      id: 3,
      balance: 5_000,
    },
  ];

  findById = async (id: number) => {
    sleep(50);
    const findItem = this.bankAccountList.find((v) => v.id === id);
    if (!findItem) {
      throw new Error(`bankAccount: ${id}가 존재하지 않습니다.`);
    }

    return { ...findItem };
  };

  update = async (id: number, balance: number) => {
    const findItem = this.bankAccountList.find((v) => v.id === id);

    if (!findItem) {
      throw new Error(`bankAccount: ${id}가 존재하지 않습니다.`);
    }

    // sleep(500);

    findItem.balance = balance;

    return findItem;
  };
}
