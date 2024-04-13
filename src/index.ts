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
    console.log("wndrks");
    const balance = await this.bankAccountService.getBalance(1);
    console.log(balance);
  }
}

const app = new App();

Promise.all([app.start(), app.start()]);
