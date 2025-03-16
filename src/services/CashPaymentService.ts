import {IPaymentService} from "@services/IPaymentService";
import {Drink} from "@models/Drink";
import {VendingMachine} from "@models/VendingMachine";

/**
 * @class CashPaymentService
 * @implements IPaymentService
 * @description 현금 결제 처리를 담당하는 서비스 클래스입니다.
 *              현금 투입 잔액을 바탕으로 결제 처리, 추가 구매 가능 여부 확인, 잔액 환불 기능을 제공합니다.
 */
export class CashPaymentService implements IPaymentService {
  /**
   * @private
   * @function calculateChange
   * @description 주어진 투입 잔액에서 음료 가격을 차감하여 거스름돈을 계산하는 순수 함수입니다.
   * @param {number} currentBalance - 현재 투입된 현금 잔액
   * @param {number} drinkPrice - 구매할 음료의 가격
   * @returns {number} 계산된 거스름돈
   */
  private calculateChange(currentBalance: number, drinkPrice: number): number {
    return currentBalance - drinkPrice;
  }

  /**
   * @function processPayment
   * @description 현금 결제 과정을 처리합니다.
   *              투입 금액이 부족할 경우 메시지를 반환하고, 잔액에 따른 거스름돈 계산 및 재고 차감 후 결제 성공 메시지를 반환합니다.
   * @param {Drink} drink - 구매할 음료 정보 객체
   * @param {VendingMachine} machine - 자판기 인스턴스 (잔액, 재고, 거스름돈 관리)
   * @returns {string} 결제 처리 결과 메시지
   */
  processPayment(drink: Drink, machine: VendingMachine): string {
    if (machine.getCurrentBalance() < drink.price) {
      return "[금액 부족 메시지] 투입 금액이 부족합니다.";
    }
    const changeNeeded = this.calculateChange(machine.getCurrentBalance(), drink.price);

    if (changeNeeded > 0 && machine.getChangePool() < changeNeeded) {
      const refundAmount = machine.getCurrentBalance();
      machine.resetCurrentBalance();
      return `[거스름돈 부족 메시지] 거스름돈(${changeNeeded}원) 부족! ${refundAmount}원 환불 후 종료`;
    }

    /** 결제 성공: 재고 차감, 잔액 및 거스름돈 처리 */
    machine.reduceStock(drink.name);
    machine.deductFromCurrentBalance(drink.price);
    return `[현금 결제 완료] '${drink.name}' 구매 성공! 반환할 잔돈: ${machine.getCurrentBalance()}원`;
  }

  /**
   * @function canPurchaseMore
   * @description 추가 구매가 가능한지 여부를 확인합니다.
   *              자판기 내 모든 음료 중 최소 가격 이상의 금액을 보유하고 있는지 판단합니다.
   * @param {VendingMachine} machine - 자판기 인스턴스
   * @returns {boolean} 추가 구매 가능 여부 (true: 가능, false: 불가능)
   */
  canPurchaseMore(machine: VendingMachine): boolean {
    const minPrice = Math.min(...machine.listDrinks().map(d => d.price));
    return machine.getCurrentBalance() >= minPrice;
  }

  /**
   * @function refund
   * @description 현금 결제의 환불 처리(잔액 반환)을 수행합니다.
   *              투입 잔액이 없는 경우 해당 메시지를, 잔액이 있는 경우 환불 후 성공 메시지를 반환합니다.
   * @param {VendingMachine} machine - 자판기 인스턴스
   * @returns {string} 환불 처리 결과 메시지
   */
  refund(machine: VendingMachine): string {
    const refundAmount = machine.getCurrentBalance();
    if (refundAmount === 0) {
      return "[반환할 금액 없음 메시지]";
    }

    machine.deductFromChangePool(refundAmount);
    return `[거스름돈 반환] ${refundAmount}원 환불 완료`;
  }
}
