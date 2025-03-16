import {Drink} from "@models/Drink";

/**
 * @class VendingMachine
 * @description 자판기의 상태(재고, 거스름돈, 잔액 등)를 관리하고 결제를 처리하는 클래스입니다.
 */
export class VendingMachine {
  /** 자판기가 고장났는지 여부 */
  private isMachineBroken: boolean;

  /** 자판기가 보유한 음료 목록 (불변) */
  private readonly drinks: Drink[];

  /** 자판기 거스름돈 풀 (현금 결제용) */
  private changePool: number;

  /** 현재 투입된 현금 잔액 */
  private currentBalance: number;

  /** 현재 사용 중인 카드 잔액 */
  private cardBalance: number;

  /**
   * @constructor
   * @description VendingMachine을 초기화합니다.
   */
  constructor() {
    this.isMachineBroken = false;
    this.drinks = [
      {name: "콜라", price: 1100, stock: 5},
      {name: "물", price: 600, stock: 5},
      {name: "커피", price: 700, stock: 5},
    ];
    this.changePool = 30000;
    this.currentBalance = 0;
    this.cardBalance = 0;
  }

  /**
   * @description 현재 자판기에서 판매 중인 음료 목록을 반환합니다.
   * @returns {Drink[]} 음료 목록
   */
  public listDrinks(): Drink[] {
    return this.drinks;
  }

  /**
   * @description 특정 음료의 재고를 1 감소시킵니다.
   * @param {string} drinkName - 감소시킬 음료의 이름
   * @returns {boolean} 재고 감소 성공 여부 (true: 성공, false: 실패)
   */
  public reduceStock(drinkName: string): boolean {
    const drink = this.drinks.find((d) => d.name === drinkName);
    if (drink && drink.stock > 0) {
      drink.stock -= 1;
      return true;
    }
    return false;
  }

  /**
   * @description 현재 투입된 현금 잔액을 반환합니다.
   * @returns {number} 현금 잔액
   */
  public getCurrentBalance(): number {
    return this.currentBalance;
  }

  /**
   * @description 현금을 투입하여 현재 잔액을 증가시킵니다.
   * @param {number} amount - 추가할 금액
   */
  public addToCurrentBalance(amount: number): void {
    this.currentBalance += amount;
  }

  /**
   * @description 현재 잔액에서 특정 금액을 차감합니다.
   * @param {number} amount - 차감할 금액
   */
  public deductFromCurrentBalance(amount: number): void {
    this.currentBalance -= amount;
    if (this.currentBalance < 0) this.currentBalance = 0;
  }

  /**
   * @description 현재 현금 잔액을 0으로 초기화합니다.
   */
  public resetCurrentBalance(): void {
    this.currentBalance = 0;
  }

  /**
   * @description 현재 카드 잔액을 반환합니다.
   * @returns {number} 카드 잔액
   */
  public getCardBalance(): number {
    return this.cardBalance;
  }

  /**
   * @description 카드 잔액을 설정합니다.
   * @param {number} amount - 카드 잔액 설정값
   */
  public setCardBalance(amount: number): void {
    this.cardBalance = amount;
  }

  /**
   * @description 카드에서 지정된 금액을 차감합니다.
   * @param {number} amount - 차감할 금액
   */
  public deductCardBalance(amount: number): void {
    this.cardBalance -= amount;
  }

  /**
   * @description 자판기 내 거스름돈 풀의 잔액을 반환합니다.
   * @returns {number} 거스름돈 잔액
   */
  public getChangePool(): number {
    return this.changePool;
  }

  /**
   * @description 자판기 내 거스름돈에서 특정 금액을 차감합니다.
   * @param {number} amount - 차감할 금액
   */
  public deductFromChangePool(amount: number): void {
    this.changePool -= amount;
  }

  /**
   * @description 자판기가 고장 상태인지 여부를 반환합니다.
   * @returns {boolean} 고장 여부 (true: 고장, false: 정상)
   */
  public isBroken(): boolean {
    return this.isMachineBroken;
  }

  /**
   * @description 자판기의 고장 여부를 설정합니다.
   * @param {boolean} isBroken - 고장 상태 (true: 고장, false: 정상)
   */
  public setMachineBroken(isBroken: boolean): void {
    this.isMachineBroken = isBroken;
  }

  /**
   * @description 현재 자판기의 상태(잔액, 거스름돈, 재고)를 문자열로 반환합니다.
   * @returns {string} 자판기 상태 정보
   */
  public getStatus(): string {
    return `자판기 상태: 현금 잔액=${this.currentBalance}원, 카드 잔액=${this.cardBalance}원, 거스름돈 풀=${this.changePool}원, 재고=[${this.drinks
      .map((d) => `${d.name}(${d.stock}개)`)
      .join(", ")}]`;
  }
}
