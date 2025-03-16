import {IPaymentService} from "@services/IPaymentService";
import {Drink} from "@models/Drink";
import {VendingMachine} from "@models/VendingMachine";

/**
 * @class CardPaymentService
 * @implements IPaymentService
 * @description 카드 결제 처리를 위한 서비스 클래스입니다.
 *              카드 잔액 확인, 결제 처리 및 환불(연결 해제) 기능을 제공합니다.
 *
 */
export class CardPaymentService implements IPaymentService {
  /**
   * @description 카드 결제 프로세스를 처리합니다.
   *              카드 잔액이 충분하지 않으면 잔액을 초기화하고 결제를 취소합니다.
   *              카드 잔액이 충분할 경우, 해당 음료의 재고를 감소시키고 카드 잔액에서 음료 가격을 차감합니다.
   * @param {Drink} drink - 구매할 음료 정보 객체
   * @param {VendingMachine} machine - 자판기 인스턴스 (카드 잔액 및 재고 관리)
   * @returns {string} 결제 처리 결과 메시지
   */
  processPayment(drink: Drink, machine: VendingMachine): string {
    if (machine.getCardBalance() < drink.price) {
      machine.setCardBalance(0);
      return `[카드 잔액 부족 메시지] 카드 잔액 부족! 결제 취소`;
    }
    machine.reduceStock(drink.name);
    machine.deductCardBalance(drink.price);
    return `[카드 결제 완료] '${drink.name}' 구매 성공! 남은 카드 잔액: ${machine.getCardBalance()}원`;
  }

  /**
   * @description 추가 구매가 가능한지 확인합니다.
   *              자판기에 있는 음료 중 최소 가격 이상의 음료를 구매할 수 있을 만큼의 카드 잔액이 있는지 확인합니다.
   * @param {VendingMachine} machine - 자판기 인스턴스
   * @returns {boolean} 추가 구매 가능 여부 (true: 가능, false: 불가능)
   */
  canPurchaseMore(machine: VendingMachine): boolean {
    const minPrice = Math.min(...machine.listDrinks().map(d => d.price));
    return machine.getCardBalance() >= minPrice;
  }

  /**
   * @function refund
   * @description 카드 결제의 경우 환불(연결 해제) 처리를 수행하지 않고,
   *              단순히 최종 카드 잔액을 반환하는 메시지를 제공합니다.
   * @param {VendingMachine} machine - 자판기 인스턴스
   * @returns {string} 최종 카드 잔액 메시지
   */
  refund(machine: VendingMachine): string {
    return `[카드 결제 완료] 최종 카드 잔액: ${machine.getCardBalance()}원`;
  }
}
