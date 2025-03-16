import { CashPaymentService } from "@services/CashPaymentService";
import { VendingMachine } from "@models/VendingMachine";
import { Drink } from "@models/Drink";

describe("CashPaymentService", () => {
  let machine: VendingMachine;
  let cashService: CashPaymentService;

  beforeEach(() => {
    machine = new VendingMachine();
    cashService = new CashPaymentService();
    machine.addToCurrentBalance(5000);
  });

  test("현금 결제 성공 시 잔액 차감", () => {
    const drink: Drink = { name: "콜라", price: 1100, stock: 5 };
    const result = cashService.processPayment(drink, machine);
    expect(result).toContain("구매 성공");
    expect(machine.getCurrentBalance()).toBe(5000 - 1100);
  });

  test("현금 잔액 부족 시 결제 실패", () => {
    machine.resetCurrentBalance();
    const drink: Drink = { name: "커피", price: 700, stock: 5 };
    const result = cashService.processPayment(drink, machine);
    expect(result).toContain("금액 부족 메시지");
  });

  test("거스름돈 부족 시 환불 처리", () => {
    machine.resetCurrentBalance();
    machine.addToCurrentBalance(1000);
    machine.deductFromChangePool(machine.getChangePool()); // 거스름돈 풀 0으로 만들기.
    const drink: Drink = { name: "물", price: 600, stock: 5 };
    const result = cashService.processPayment(drink, machine);
    expect(result).toContain("거스름돈 부족 메시지");
  });

  test("환불: refund()", () => {
    machine.resetCurrentBalance();
    machine.addToCurrentBalance(2000);
    const refundMsg = cashService.refund(machine);
    expect(refundMsg).toContain("거스름돈 반환");
    expect(refundMsg).toContain("2000원");
  });

  test("추가 구매 가능 여부: canPurchaseMore()", () => {
    const affordable = cashService.canPurchaseMore(machine);
    const minPrice = Math.min(...machine.listDrinks().map(d => d.price));
    expect(affordable).toBe(machine.getCurrentBalance() >= minPrice);
  });
});
