import { CardPaymentService } from "@services/CardPaymentService";
import { VendingMachine } from "@models/VendingMachine";
import { Drink } from "@models/Drink";

describe("CardPaymentService", () => {
  let machine: VendingMachine;
  let cardService: CardPaymentService;

  beforeEach(() => {
    machine = new VendingMachine();
    cardService = new CardPaymentService();
    machine.setCardBalance(5000);
  });

  test("카드 잔액이 충분하면 결제 성공", () => {
    const drink: Drink = { name: "콜라", price: 1100, stock: 5 };
    const result = cardService.processPayment(drink, machine);
    expect(result).toContain("구매 성공");
    expect(machine.getCardBalance()).toBe(5000 - 1100);
  });

  test("카드 잔액 부족 시 결제 실패", () => {
    machine.setCardBalance(500);
    const drink: Drink = { name: "커피", price: 700, stock: 5 };
    const result = cardService.processPayment(drink, machine);
    expect(result).toContain("카드 잔액 부족 메시지");
  });

  test("재고 부족 시 결제 실패", () => {
    const drink: Drink = { name: "콜라", price: 1100, stock: 0 };
    const secondResult = cardService.processPayment(drink, machine);
    expect(secondResult).toContain("재고 부족 메시지");
  });

  test("환불: refund()", () => {
    const refundMsg = cardService.refund(machine);
    expect(refundMsg).toContain("최종 카드 잔액");
    expect(machine.getCardBalance()).toBe(5000);
  });
});
