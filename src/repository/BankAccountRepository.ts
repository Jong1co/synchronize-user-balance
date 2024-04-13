export interface BankAccount {
  id: number;
  balance: number;
}

export interface BankAccountRepository {
  findById: (id: number) => Promise<BankAccount>;
  update: (id: number, balance: number) => Promise<BankAccount>;
}
