import {getPaymentService} from "@services/PaymentServiceFactory";
import {VendingMachine} from "@models/VendingMachine";
import {IPaymentService} from "@services/IPaymentService";
import {CashPaymentService} from "@services/CashPaymentService";
import {CardPaymentService} from "@services/CardPaymentService";
import {askQuestion} from "@utils/input";

jest.mock("@utils/input", () => ({
  askQuestion: jest.fn()
}));

const mockedAskQuestion = askQuestion as jest.Mock;

describe("PaymentServiceFactory (getPaymentService)", () => {
  let machine: VendingMachine;

  beforeEach(() => {
    machine = new VendingMachine();
    machine.resetCurrentBalance();
    machine.setCardBalance(0);
    jest.clearAllMocks();
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  test("getPaymentService(): 입력이 'cash'일 때 CashPaymentService를 반환한다", async () => {
    mockedAskQuestion.mockResolvedValueOnce("1000").mockResolvedValueOnce("n");
    const paymentService: IPaymentService = await getPaymentService("cash", machine);
    expect(paymentService).toBeInstanceOf(CashPaymentService);
    expect(machine.getCurrentBalance()).toBe(1000);
  });

  test("getPaymentService(): 입력이 'card'일 때 CardPaymentService를 반환한다", async () => {
    mockedAskQuestion.mockResolvedValueOnce("5000");
    const paymentService: IPaymentService = await getPaymentService("card", machine);
    expect(paymentService).toBeInstanceOf(CardPaymentService);
    expect(machine.getCardBalance()).toBe(5000);
  });

  test("잘못된 결제 수단 입력 시 에러 발생", async () => {
    await expect(getPaymentService("invalid", machine)).rejects.toThrow("[잘못된 지불 수단입니다]");
  });
});
