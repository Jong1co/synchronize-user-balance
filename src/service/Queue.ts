import { BankAccount } from "../repository/BankAccountRepository";

export type BankAccountUpdateAction = "deposit" | "withdrawal";

export type BankAccountQueueNode = {
  func: () => Promise<BankAccount>;
  action: BankAccountUpdateAction;
};

export interface BankAccountServiceQueue {
  isValid: boolean;
  push: (node: BankAccountQueueNode) => void;
  pop: () => () => Promise<BankAccount>;
}

export class BankAccountServiceQueueImpl implements BankAccountServiceQueue {
  private queue: Array<BankAccountQueueNode> = [];

  get isValid(): boolean {
    const depositActions = this.queue.filter(
      (node) => node.action === "deposit"
    );

    return depositActions.length <= 1;
  }

  push(node: BankAccountQueueNode) {
    this.queue.push(node);
  }

  pop() {
    const { func } = this.queue.shift() as BankAccountQueueNode;
    return func;
  }

  async exec() {
    while (this.queue.length > 0) {
      await this.pop();
    }
  }

  // while문은 동기적인 특성을 갖고 있기 때문에, 아래와 같이 사용 불가능
  // async exec() {
  //   while (this.queue.length > 0) {
  //     await this.pop();
  //   }
  // }
}
