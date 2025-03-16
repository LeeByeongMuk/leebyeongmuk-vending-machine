import {Drink} from "@models/Drink";
import {VendingMachine} from "@models/VendingMachine";

/**
 * @interface IPaymentService
 * @description 결제 관련 기능을 추상화하는 인터페이스입니다.
 *              이 인터페이스를 구현하는 클래스는 음료 구매 처리, 추가 구매 가능 여부 확인, 환불 기능을 제공해야 합니다.
 */
export interface IPaymentService {
  /**
   * @description 지정된 음료의 결제를 처리합니다.
   *              카드나 현금 결제에 따른 잔액 및 재고 관리를 수행합니다.
   * @param {Drink} drink - 구매할 음료 정보 객체
   * @param {VendingMachine} machine - 자판기 인스턴스 (잔액 및 재고 관리)
   * @returns {string} 결제 처리 결과 메시지
   */
  processPayment(drink: Drink, machine: VendingMachine): string;

  /**
   * @description 추가 구매가 가능한지 여부를 확인합니다.
   *              예를 들어, 잔액이 최소 음료 가격 이상이면 추가 구매가 가능하다고 판단합니다.
   * @param {VendingMachine} machine - 자판기 인스턴스
   * @returns {boolean} 추가 구매 가능 여부 (true: 가능, false: 불가능)
   */
  canPurchaseMore(machine: VendingMachine): boolean;

  /**
   * @description 환불 또는 결제 취소 처리를 수행합니다.
   *              카드 결제인 경우 연결 해제, 현금 결제인 경우 잔액 환불 등의 처리를 담당합니다.
   * @param {VendingMachine} machine - 자판기 인스턴스
   * @returns {string} 환불 처리 결과 메시지
   */
  refund(machine: VendingMachine): string;
}
