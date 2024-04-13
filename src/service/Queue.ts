import { BankAccount } from "../repository/BankAccountRepository";

export type BankAccountUpdateAction = "deposit" | "withdrawal";

export type BankAccountQueueNode = {
  func: () => Promise<BankAccount>;
  action: BankAccountUpdateAction;
};

export interface BankAccountServiceQueue {
  isValid: () => void;
  push: (node: BankAccountQueueNode) => Promise<any>;
  dequeue: () => () => Promise<BankAccount>;
  exec: () => void;
}

export class BankAccountServiceQueueImpl implements BankAccountServiceQueue {
  private queue: Array<BankAccountQueueNode> = [];
  private isExec: boolean = false;

  isValid = () => {
    const depositActions = this.queue.filter(
      (node) => node.action === "deposit"
    );

    if (depositActions.length > 1) {
      throw new Error("동시에 입금할 수 없습니다.");
    }
  };

  async push(node: BankAccountQueueNode) {
    this.queue.push(node);
    this.isValid();
    console.log("hi");

    if (!this.isExec) {
      this.isExec = true;
      return await this.exec();
    }
  }

  dequeue() {
    const { func } = this.queue.shift() as BankAccountQueueNode;
    return func;
  }

  // 재귀함수 사용
  async exec() {
    const { func } = this.queue[0];

    await func().then((res) => {
      console.log(res);
      this.dequeue();
      if (this.queue.length > 0) {
        this.exec();
      } else {
        this.isExec = false;
      }
    });
  }

  // while문은 동기적인 특성을 갖고 있기 때문에, 아래와 같이 사용 불가능
  // async exec() {
  //   while (this.queue.length > 0) {
  //     await this.pop();
  //   }
  // }
}

// 싱글톤 패턴으로 추후에 Queue만 갈아끼워주면 가능하도록 ?
// 이게 맞나,,
export default new BankAccountServiceQueueImpl();
