import {
  BankAccount,
  BankAccountRepository,
} from "../repository/BankAccountRepository";

export interface BankAccountService {
  deposit: (id: number, balance: number) => Promise<BankAccount>;
  withdrawal: (id: number, balance: number) => Promise<BankAccount>;
  getBalance: (id: number) => Promise<BankAccount>;
}

export class BankAccountServiceImpl implements BankAccountService {
  bankAccountRepository: BankAccountRepository;

  constructor(bankAccountRepository: BankAccountRepository) {
    this.bankAccountRepository = bankAccountRepository;
  }

  getBalance = async (id: number) => {
    const bankAccount = await this.bankAccountRepository.findById(id);
    return bankAccount;
  };

  deposit = async (id: number, amount: number) => {
    const bankAccount = await this.bankAccountRepository.findById(id);
    console.log(bankAccount, amount);
    return await this.bankAccountRepository.update(
      id,
      bankAccount.balance + amount
    );
  };

  withdrawal = async (id: number, amount: number) => {
    const bankAccount = await this.bankAccountRepository.findById(id);

    if (bankAccount.balance < amount) {
      throw new Error("잔액이 부족합니다.");
    }

    return await this.bankAccountRepository.update(
      id,
      bankAccount.balance - amount
    );
  };
}
