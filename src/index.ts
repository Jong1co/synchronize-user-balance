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
    await this.bankAccountService.deposit(1, 5000);
    const balance = await this.bankAccountService.getBalance(1);
  }
}

const app = new App();

Promise.all([app.start(), app.start()]);
