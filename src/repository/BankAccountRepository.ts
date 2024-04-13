export interface BankAccount {
  id: number;
  balance: number;
}

export interface BankAccountRepository {
  findById: (id: number) => Promise<BankAccount>;
  updateById: (id: number, balance: number) => Promise<BankAccount>;
  startDeposit: (id: number) => void;
  endDeposit: (id: number) => void;
  isLock: (id: number) => boolean;
}
