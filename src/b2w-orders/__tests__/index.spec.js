import { getOrders } from "../index.js";
import { jest } from "@jest/globals";

const orders = [
  {
    name: "A",
    date: "2016-10-04T14:30:37.040Z",
  },
  {
    name: "B",
    date: "2016-10-03T14:30:37.040Z",
  },
  {
    name: "C",
    date: "2016-10-02T14:30:37.040Z",
  },
];
describe("getOrders", () => {
  beforeEach(() => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve(orders),
      })
    );
  });
  it("returns orders", async () => {
    const orders = await getOrders();
    expect(orders).toHaveLength(3);
  });
  it("returns orders for begindate", async () => {
    const orders = await getOrders({ begindate: "10-03-2016" });
    expect(orders).toHaveLength(2);
  });

  it("returns orders for end date", async () => {
    const orders = await getOrders({ enddate: "10-03-2016" });
    expect(orders).toHaveLength(1);
  });
  it("returns orders for begin and end date", async () => {
    const orders = await getOrders({
      begindate: "10-01-2016",
      enddate: "10-04-2016",
    });
    expect(orders).toHaveLength(2);
  });
});
