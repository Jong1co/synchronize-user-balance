import { MemoryBankAccountRepository } from "../../repository/MemoryBankAccountRepository";
import {
  BankAccountService,
  BankAccountServiceImpl,
} from "../../service/BankAccountService";

describe("BankAccountService > getBalance ", () => {
  let bankAccountService: BankAccountService;

  beforeEach(() => {
    const bankAccountList = [
      {
        id: 1,
        balance: 20_000_000,
      },
      {
        id: 2,
        balance: 0,
      },
      {
        id: 3,
        balance: 5_000,
      },
    ];

    bankAccountService = new BankAccountServiceImpl(
      new MemoryBankAccountRepository(bankAccountList)
    );
  });

  it("입금 요청이 같은 id로 동시에 2개 이상 들어올 경우, 에러를 반환해야 한다.", async () => {
    await expect(
      Promise.all([
        bankAccountService.deposit(1, 100),
        bankAccountService.deposit(1, 100),
      ])
    ).rejects.toThrow();
  });
});
