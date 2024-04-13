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
    this.bankAccountRepository.startDeposit(id);

    const bankAccount = await this.bankAccountRepository.findById(id);

    if (this.bankAccountRepository.isLock(id)) {
      throw new Error("동시에 입금할 수 없습니다.");
    }
    return await this.bankAccountRepository
      .updateById(id, bankAccount.balance + amount)
      .finally(() => this.bankAccountRepository.endDeposit(id));
  };

  withdrawal = async (id: number, amount: number) => {
    if (amount <= 0) throw new Error("잘못된 금액입니다.");

    const bankAccount = await this.bankAccountRepository.findById(id);

    if (bankAccount.balance < amount) {
      throw new Error("잔액이 부족합니다.");
    }

    return await this.bankAccountRepository.updateById(
      id,
      bankAccount.balance - amount
    );
  };
}
