import { sleep } from "../utils/sleep";
import { BankAccount, BankAccountRepository } from "./BankAccountRepository";

export class MemoryBankAccountRepository implements BankAccountRepository {
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

  private lockMap: Record<number, boolean> = {};

  constructor(bankAccountList?: BankAccount[]) {
    if (bankAccountList) this.bankAccountList = bankAccountList;
  }

  findById = async (id: number) => {
    sleep(50);
    const findItem = this.bankAccountList.find((v) => v.id === id);
    if (!findItem) {
      throw new Error(`bankAccount: ${id}가 존재하지 않습니다.`);
    }

    return { ...findItem };
  };

  updateById = async (id: number, balance: number) => {
    const result = await this.update(id, balance);

    return result;
  };

  private update = async (id: number, balance: number) => {
    const findItem = this.bankAccountList.find((v) => v.id === id);

    if (!findItem) {
      throw new Error(`bankAccount: ${id}가 존재하지 않습니다.`);
    }

    // sleep(500);

    findItem.balance = balance;

    return findItem;
  };

  startDeposit = (id: number) => {
    this.lockMap[id] = true;
  };

  endDeposit = (id: number) => {
    if (this.lockMap[id]) this.lockMap[id] = false;
  };

  isLock = (id: number) => {
    return Boolean(this.lockMap[id]);
  };
}
