import {
  BankAccount,
  BankAccountRepository,
} from "../repository/BankAccountRepository";
import BankAccountServiceQueueImpl, { BankAccountServiceQueue } from "./Queue";

export interface BankAccountService {
  deposit: (id: number, balance: number) => Promise<any>;
  withdrawal: (id: number, balance: number) => Promise<any>;
  getBalance: (id: number) => Promise<BankAccount>;
}

export class BankAccountServiceImpl implements BankAccountService {
  bankAccountRepository: BankAccountRepository;

  bankAccountServiceQueue: BankAccountServiceQueue;

  constructor(bankAccountRepository: BankAccountRepository) {
    this.bankAccountRepository = bankAccountRepository;
    this.bankAccountServiceQueue = BankAccountServiceQueueImpl;
  }

  getBalance = async (id: number) => {
    const bankAccount = await this.bankAccountRepository.findById(id);
    if (!bankAccount) throw new Error("존재하지 않는 유저입니다.");

    return bankAccount;
  };

  deposit = async (id: number, amount: number) => {
    if (amount <= 0) throw new Error("잘못된 금액입니다.");

    const func = async () => {
      const bankAccount = await this.bankAccountRepository.findById(id);

      return await this.bankAccountRepository
        .updateById(id, bankAccount.balance + amount)
        .finally(() => this.bankAccountRepository.endDeposit(id));
    };

    try {
      this.bankAccountServiceQueue.push({ func, action: "deposit" });
    } catch (e) {
      throw new Error("");
    }
  };

  withdrawal = async (id: number, amount: number) => {
    if (amount <= 0) throw new Error("잘못된 금액입니다.");

    const func = async () => {
      const bankAccount = await this.bankAccountRepository.findById(id);

      if (bankAccount.balance < amount) {
        throw new Error("잔액이 부족합니다.");
      }

      return await this.bankAccountRepository.updateById(
        id,
        bankAccount.balance - amount
      );
    };

    this.bankAccountServiceQueue.push({ func, action: "withdrawal" });
  };
}
