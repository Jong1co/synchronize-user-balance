import { MockBankAccountRepository } from "../repository/MockBankAccountRepository";
import {
  BankAccountService,
  BankAccountServiceImpl,
} from "../service/BankAccountService";
describe("BankAccountService :: ", () => {
  let bankAccountService: BankAccountService;

  beforeEach(() => {
    bankAccountService = new BankAccountServiceImpl(
      new MockBankAccountRepository()
    );
  });

  it("deposit :: 입금 시 amount만큼 금액이 증가해야 한다.", async () => {
    await bankAccountService.deposit(1, 1000);
    const { balance } = await bankAccountService.getBalance(1);

    expect(balance).toBe(20_001_000);
  });
});
