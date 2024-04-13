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
    if (!bankAccount) throw new Error("존재하지 않는 유저입니다.");

    return bankAccount;
  };

  deposit = async (id: number, amount: number) => {
    if (amount <= 0) throw new Error("잘못된 금액입니다.");

    const bankAccount = await this.bankAccountRepository.findById(id);
    console.log(bankAccount, amount);
    return await this.bankAccountRepository.update(
      id,
      bankAccount.balance + amount
    );
  };

  withdrawal = async (id: number, amount: number) => {
    if (amount <= 0) throw new Error("잘못된 금액입니다.");

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
