import { VendingMachine } from "@models/VendingMachine";
import { Drink } from "@models/Drink";

describe("VendingMachine", () => {
  let machine: VendingMachine;

  beforeEach(() => {
    machine = new VendingMachine();
  });

  test("음료 목록 반환: listDrinks()", () => {
    const drinks: Drink[] = machine.listDrinks();
    expect(Array.isArray(drinks)).toBe(true);
    expect(drinks.length).toBeGreaterThan(0);
  });

  test("재고 차감: reduceStock()", () => {
    const initialStock = machine.listDrinks().find(d => d.name === "콜라")?.stock || 0;
    const success = machine.reduceStock("콜라");
    expect(success).toBe(true);
    const newStock = machine.listDrinks().find(d => d.name === "콜라")?.stock;
    expect(newStock).toBe(initialStock - 1);
  });

  test("현금 잔액 추가 및 차감", () => {
    machine.addToCurrentBalance(5000);
    expect(machine.getCurrentBalance()).toBe(5000);
    machine.deductFromCurrentBalance(1100);
    expect(machine.getCurrentBalance()).toBe(5000 - 1100);
  });

  test("잔액 초기화: resetCurrentBalance()", () => {
    machine.addToCurrentBalance(3000);
    machine.resetCurrentBalance();
    expect(machine.getCurrentBalance()).toBe(0);
  });

  test("getStatus() 출력 문자열에 주요 정보 포함", () => {
    const status = machine.getStatus();
    expect(status).toMatch(/현금 잔액=/);
    expect(status).toMatch(/재고=\[/);
  });

  test("카드 잔액 추가 및 차감", () => {
    machine.setCardBalance(10000);
    expect(machine.getCardBalance()).toBe(10000);
    machine.deductCardBalance(5000);
    expect(machine.getCardBalance()).toBe(10000 - 5000);
  })
});
