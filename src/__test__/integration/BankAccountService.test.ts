import { MemoryBankAccountRepository } from "../../repository/MemoryBankAccountRepository";
import {
  BankAccountService,
  BankAccountServiceImpl,
} from "../../service/BankAccountService";

describe("BankAccountService > 같은 id로의 접근", () => {
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

  it("잔액이 0원인 계좌에서 출금 시, 에러를 반환한다.", async () => {
    await expect(
      Promise.all([bankAccountService.withdrawal(2, 100)])
    ).rejects.toThrow();
  });

  it("잔액이 0원인 계좌에서 출금 후 입금 시, 에러를 반환한다.", async () => {
    await expect(
      Promise.all([
        bankAccountService.withdrawal(2, 100),
        bankAccountService.deposit(2, 100),
      ])
    ).rejects.toThrow();
  });

  it("잔액이 0원인 계좌에서 입금 후 출금 시, 값을 반환한다.", async () => {
    await Promise.all([
      bankAccountService.deposit(2, 100),
      bankAccountService.withdrawal(2, 100),
    ]);

    const { balance } = await bankAccountService.getBalance(2);
    expect(balance).toBe(0);
  });

  it("입금 요청이 같은 id로 동시에 2개 이상 들어올 경우, 에러를 반환해야 한다.", async () => {
    await Promise.all([
      bankAccountService.withdrawal(1, 100),
      bankAccountService.deposit(1, 100),
    ]);

    const { balance: balance2 } = await bankAccountService.getBalance(1);
    expect(balance2).toBe(20_000_000);
  });

  it("입금 요청이 같은 id로 동시에 2개일 경우, 기존과 동일한 값을 반환한다.", async () => {
    await Promise.all([
      bankAccountService.deposit(1, 100),
      bankAccountService.deposit(1, 100),
    ]);

    const { balance } = await bankAccountService.getBalance(1);
    expect(balance).toBe(20_000_000);
  });

  it("입금과 출금 요청이 같은 id로 동시에 여러개 들어올 경우, 출금된 금액만 적용한다.", async () => {
    await Promise.all([
      bankAccountService.deposit(1, 100),
      bankAccountService.deposit(1, 100),
      bankAccountService.deposit(1, 100),
      bankAccountService.deposit(1, 100),
      bankAccountService.withdrawal(1, 100),
    ]);

    const { balance } = await bankAccountService.getBalance(1);
    expect(balance).toBe(20_000_000 - 100);
  });

  it("입금, 입금, 출금을 동시에 호출 시 출금된 금액만 적용한다.", async () => {
    await Promise.all([
      bankAccountService.deposit(1, 100),
      bankAccountService.deposit(1, 100),
      bankAccountService.withdrawal(1, 100),
    ]);

    expect((await bankAccountService.getBalance(1)).balance).toBe(
      20_000_000 - 100
    );
  });

  it("같은 가격을 동시에 입출금 했을 때, 원래 값과 동일해야 한다.", async () => {
    await Promise.all([
      bankAccountService.deposit(1, 100),
      bankAccountService.withdrawal(1, 100),
    ]);

    const { balance: balance2 } = await bankAccountService.getBalance(1);
    expect(balance2).toBe(20_000_000);
  });
});

describe("BankAccountService > 다른 id로의 접근", () => {
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

  it("잔액이 0원인 계좌에서 출금 후 입금 시, 에러를 반환한다.", async () => {
    await Promise.all([
      bankAccountService.deposit(1, 100),
      bankAccountService.deposit(2, 100),
      bankAccountService.deposit(3, 100),
    ]);

    const { balance: balance1 } = await bankAccountService.getBalance(1);
    const { balance: balance2 } = await bankAccountService.getBalance(2);
    const { balance: balance3 } = await bankAccountService.getBalance(3);

    expect(balance1).toBe(20_000_100);
    expect(balance2).toBe(100);
    expect(balance3).toBe(5_100);
  });

  it("다른 id 계좌에 입금이 발생하였을 때, 에러를 반환해서는 안 된다.", async () => {
    await Promise.all([
      bankAccountService.deposit(1, 100),
      bankAccountService.deposit(2, 100),
    ]);

    const { balance: balance1 } = await bankAccountService.getBalance(1);
    const { balance: balance2 } = await bankAccountService.getBalance(2);

    expect(balance1).toBe(20_000_100);
    expect(balance2).toBe(100);
  });
});
