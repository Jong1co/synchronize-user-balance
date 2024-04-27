import { MemoryBankAccountRepository } from "./repository/MemoryBankAccountRepository";
import {
  BankAccountService,
  BankAccountServiceImpl,
} from "./service/BankAccountService";

export class App {
  bankAccountService: BankAccountService;

  constructor() {
    this.bankAccountService = new BankAccountServiceImpl(
      new MemoryBankAccountRepository()
    );
  }

  async start() {
    await Promise.all([
      this.bankAccountService.deposit(1, 5000),
      this.bankAccountService.withdrawal(1, 5000),
      this.bankAccountService.deposit(1, 5000),
    ]);

    const balance = await this.bankAccountService.getBalance(1);

    return balance;
  }
}

const app = new App();

(async () => {
  const result = await app.start();
  console.log(result);
})();
