import { BankAccount } from "../repository/BankAccountRepository";
import { sleep } from "../utils/sleep";

export type BankAccountUpdateAction = "deposit" | "withdrawal";

export type BankAccountQueueNode = {
  func: () => Promise<BankAccount>;
  id: number;
  action: BankAccountUpdateAction;
};

export interface BankAccountServiceQueue {
  isValid: (id: number) => void;
  push: (node: BankAccountQueueNode) => Promise<any>;
  dequeue: () => () => Promise<BankAccount>;
  exec: () => void;
}

export class BankAccountServiceQueueImpl implements BankAccountServiceQueue {
  private queue: Array<BankAccountQueueNode> = [];
  private isExec: boolean = false;

  private getDepositActionCount = (queue: Array<BankAccountQueueNode>) => {
    return queue.reduce((accr, curr) => {
      if (curr.action !== "deposit") return accr;

      if (accr[curr.id]) {
        accr[curr.id] += 1;
      } else {
        accr[curr.id] = 1;
      }

      return accr;
    }, {} as Record<number, number>);
  };

  isValid = (id: number) => {
    const depositActionCountMap = this.getDepositActionCount(this.queue);
    console.log(this.queue);
    return !(depositActionCountMap[id] > 1);
    // const isInvalidAction = Object.values(depositActionCountMap).some(
    //   (count) => count > 1
    // );

    // if (isInvalidAction) {
    //   throw new Error("같은 아이디로 동시에 입금할 수 없습니다.");
    // }
  };

  async push(node: BankAccountQueueNode) {
    this.queue.push(node);

    if (!this.isExec) {
      this.isExec = true;
      return await this.exec();
    }
  }

  dequeue() {
    const { func } = this.queue.shift() as BankAccountQueueNode;
    return func;
  }

  private isInvalidRequest = (node: BankAccountQueueNode, id: number) => {
    return node.id === id && node.action === "deposit";
  };

  // 재귀함수 사용
  async exec() {
    const { func, id } = this.queue[0];

    await sleep(0);

    if (!this.isValid(id)) {
      //유효하지 않은 횟수만큼 콘솔 출력
      this.queue.forEach((node) => {
        this.isInvalidRequest(node, id) &&
          console.log("입금 요청이 동시에 발생했습니다.");
      });

      this.queue = this.queue.filter(
        (node) => !this.isInvalidRequest(node, id)
      );

      if (this.queue.length > 0) {
        this.exec();
      }
      return;
    }

    await func().then(() => {
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
