import {VendingMachine} from "@models/VendingMachine";
import {askQuestion} from "@utils/input";
import {getPaymentService} from "@services/PaymentServiceFactory";
import {IPaymentService} from "@services/IPaymentService";
import {CashPaymentService} from "@services/CashPaymentService";

async function main() {
  const machine = new VendingMachine();
  console.log("=== 자판기 시뮬레이션 시작 ===");

  /** 1. 자판기 사용 가능 여부 확인 */
  const useMachine = await askQuestion("자판기 사용 가능합니까? (y/n): ");
  if (useMachine.toLowerCase() !== "y" || machine.isBroken()) {
    console.log("[LED 고장 표시] 자판기가 고장났습니다.");
    process.exit(1);
  }

  /** 2. 재고 확인 */
  const totalStock = machine.listDrinks().reduce((acc, d) => acc + d.stock, 0);
  if (totalStock <= 0) {
    console.log("[LED 재고 부족 표시] 재고가 없습니다.");
    process.exit(1);
  }

  /** 3. 결제 수단 선택 및 초기 설정 */
  const paymentInput = await askQuestion("지불 수단 선택 (cash 또는 card): ");
  const paymentService: IPaymentService = await getPaymentService(paymentInput, machine);

  /** 4. 구매 루프 */
  let continuePurchase = true;
  while (continuePurchase) {
    console.log("\n구매 가능한 음료:");
    machine.listDrinks().forEach((drink, index) => {
      console.log(`${index + 1}. ${drink.name} - ${drink.price}원 (재고: ${drink.stock}개)`);
    });
    const choice = parseInt(await askQuestion("구매할 음료 번호 선택: "), 10);
    if (choice < 1 || choice > machine.listDrinks().length) {
      console.log("잘못된 선택입니다.");
      continue;
    }
    const selectedDrink = machine.listDrinks()[choice - 1];

    /** 결제 처리 및 결과 출력 */
    const result = paymentService.processPayment(selectedDrink, machine);
    console.log(result);

    const additional = await askQuestion("추가 구매하시겠습니까? (y/n): ");
    continuePurchase = additional.toLowerCase() === "y";

    /** 현금 결제인 경우, 추가 금액 투입 처리 */
    if (continuePurchase && paymentService instanceof CashPaymentService) {
      const affordable = machine.listDrinks().some(
        (d) => d.stock > 0 && machine.getCurrentBalance() >= d.price
      );
      if (!affordable) {
        const extraCash = parseInt(await askQuestion("추가 현금 투입: "), 10);
        machine.addToCurrentBalance(extraCash);
        console.log(`[현금 투입] 현재 잔액: ${machine.getCurrentBalance()}원`);
      }
    }
  }

  /** 5. 반환 처리 */
  if (paymentInput === "현금") {
    const refundInput = await askQuestion("반환 버튼을 누르시겠습니까? (y/n): ");
    if (refundInput.toLowerCase() === "y") {
      console.log(paymentService.refund(machine));
    }
  } else {
    console.log(paymentService.refund(machine));
  }

  /** 6. 최종 상태 출력 */
  console.log("\n[완료 메시지 출력]");
  console.log(machine.getStatus());
  console.log("=== 시뮬레이션 종료 ===");
}

main();
