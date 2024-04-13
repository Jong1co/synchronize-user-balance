import { MockBankAccountRepository } from "../../repository/MockBankAccountRepository";
import {
  BankAccountService,
  BankAccountServiceImpl,
} from "../../service/BankAccountService";

describe("BankAccountService > getBalance ", () => {
  let bankAccountService: BankAccountService;

  beforeEach(() => {
    bankAccountService = new BankAccountServiceImpl(
      new MockBankAccountRepository()
    );
  });

  it("계좌 조회 시, 없는 유저라면 에러를 반환해야 한다.", async () => {
    await expect(bankAccountService.getBalance(4)).rejects.toThrow();
  });

  it("계좌 조회 시, balance를 반환해야 한다.", async () => {
    const { balance } = await bankAccountService.getBalance(1);

    expect(balance).toBe(20_000_000);
  });
});

describe("BankAccountService > deposit ", () => {
  let bankAccountService: BankAccountService;

  beforeEach(() => {
    bankAccountService = new BankAccountServiceImpl(
      new MockBankAccountRepository()
    );
  });

  it("입금 시 amount만큼 금액이 증가해야 한다.", async () => {
    await bankAccountService.deposit(1, 1000);
    const { balance } = await bankAccountService.getBalance(1);

    expect(balance).toBe(20_001_000);
  });

  it("입금액 < 0일 경우, 에러를 반환한다.", async () => {
    await expect(bankAccountService.deposit(1, -1000)).rejects.toThrow();
  });

  it("입금액 === 0일 경우, 에러를 반환한다.", async () => {
    await expect(bankAccountService.deposit(1, 0)).rejects.toThrow();
  });
});

describe("BankAccountService > withdrawal ", () => {
  let bankAccountService: BankAccountService;

  beforeEach(() => {
    bankAccountService = new BankAccountServiceImpl(
      new MockBankAccountRepository()
    );
  });

  it("출금 시 amount만큼 금액이 감소해야 한다.", async () => {
    await bankAccountService.withdrawal(1, 1000);
    const { balance } = await bankAccountService.getBalance(1);

    expect(balance).toBe(19_999_000);
  });

  it("출금 시 출금액 === 잔액일 경우, 0을 반환해야 한다.", async () => {
    await bankAccountService.withdrawal(1, 20_000_000);
    const { balance } = await bankAccountService.getBalance(1);

    expect(balance).toBe(0);
  });

  it("출금 시 출금액 > 잔액일 경우, Error를 반환해야 한다.", async () => {
    await expect(
      bankAccountService.withdrawal(1, 20_000_001)
    ).rejects.toThrow();
  });

  it("출금액이 === 0일 경우, Error를 반환해야 한다.", async () => {
    await expect(bankAccountService.withdrawal(1, 0)).rejects.toThrow();
  });

  it("출금액 < 0일 경우, Error를 반환해야 한다.", async () => {
    await expect(bankAccountService.withdrawal(1, -1)).rejects.toThrow();
  });
});
