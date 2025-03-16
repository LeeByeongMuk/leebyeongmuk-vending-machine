import {CashPaymentService} from "@services/CashPaymentService";
import {CardPaymentService} from "@services/CardPaymentService";
import {VendingMachine} from "@models/VendingMachine";
import {IPaymentService} from "@services/IPaymentService";
import {askQuestion} from "@utils/input";

const VALID_CASH_DENOMINATIONS = [100, 500, 1000, 5000, 10000];

/**
 * @function processCashInput
 * @description 현금 결제 초기 입력을 처리하여, 사용자로부터 올바른 현금 단위를 받아 자판기의 잔액을 업데이트합니다.
 * @param {VendingMachine} machine - 자판기 인스턴스
 * @returns {Promise<void>}
 */
async function processCashInput(machine: VendingMachine): Promise<void> {
  let additional = "y";
  while (additional.toLowerCase() === "y") {
    const cashStr = await askQuestion("현금 투입 (100, 500, 1000, 5000, 10000): ");
    const cash = parseInt(cashStr, 10);
    if (VALID_CASH_DENOMINATIONS.includes(cash)) {
      machine.addToCurrentBalance(cash);
      console.log(`[현금 투입] 현재 잔액: ${machine.getCurrentBalance()}원`);
    } else {
      console.log("[잘못된 화폐입니다]");
    }
    additional = await askQuestion("추가 투입하시겠습니까? (y/n): ");
  }
}

/**
 * @function processCardInput
 * @description 카드 결제 초기 입력을 처리하여, 사용자로부터 카드 잔액을 받아 자판기에 설정합니다.
 * @param {VendingMachine} machine - 자판기 인스턴스
 * @returns {Promise<void>}
 */
async function processCardInput(machine: VendingMachine): Promise<void> {
  const cardBalanceStr = await askQuestion("카드 잔액을 입력하세요: ");
  const cardBalance = parseInt(cardBalanceStr, 10);
  machine.setCardBalance(cardBalance);
  console.log(`[카드 연결됨] 현재 카드 잔액: ${machine.getCardBalance()}원`);
}

/**
 * @function getPaymentService
 * @description 사용자가 선택한 결제 방식에 따라 적절한 IPaymentService 인스턴스를 생성하고,
 *              결제 방식에 따른 초기 설정(현금 투입 또는 카드 잔액 입력)을 수행합니다.
 * @param {string} paymentInput - "cash", "card", "현금", 또는 "카드" 문자열
 * @param {VendingMachine} machine - 자판기 인스턴스
 * @returns {Promise<IPaymentService>} 선택한 결제 서비스 인스턴스
 */
export async function getPaymentService(
  paymentInput: string,
  machine: VendingMachine
): Promise<IPaymentService> {
  const normalizedInput = paymentInput.toLowerCase();

  const paymentServiceFactory: { [key: string]: () => IPaymentService } = {
    "cash": () => new CashPaymentService(),
    "card": () => new CardPaymentService(),
  };

  const creator = paymentServiceFactory[normalizedInput];
  if (!creator) {
    throw new Error("[잘못된 지불 수단입니다]");
  }
  const paymentService = creator();

  // 초기 설정: 결제 방식에 따라 사용자 입력 처리
  if (normalizedInput === "cash") {
    await processCashInput(machine);
  } else if (normalizedInput === "card") {
    await processCardInput(machine);
  }
  return paymentService;
}
