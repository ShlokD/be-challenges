import pizzas from "./pizza.js";
import { v4 } from "uuid";

const rPizza = {
  method: "GET",
  url: "/pizza",
  handler: async function (request, reply) {
    try {
      reply.send(pizzas);
    } catch (e) {
      reply.send({ error: e.message });
    }
  },
};

const rAddOrder = {
  method: "POST",
  url: "/add-order",
  handler: async function (request, reply) {
    try {
      const body = request.body;
      if (!body) {
        throw new Error("Missing body");
      }
      const { name } = body;
      const pizza = pizzas.find(
        (pizza) => pizza.name.toLowerCase() === name.toLowerCase()
      );
      if (!pizza) {
        throw new Error(`${name} pizza not supported`);
      }
      const { db } = request;
      await db.read();
      if (!db.data.orders) {
        db.data.orders = [];
      }

      const id = v4();

      db.data.orders.push({
        pizza,
        id,
      });
      await db.write();
      reply.send({ msg: "OK", id });
    } catch (e) {
      reply.send({ error: e.message });
    }
  },
};

const rOrders = {
  method: "GET",
  url: "/orders",
  handler: async function (request, reply) {
    try {
      const { db } = request;
      await db.read();
      if (!db.data.orders) {
        reply.send({ orders: [] });
        return;
      }

      const orders = db.data.orders;
      reply.send({ orders });
    } catch (e) {
      reply.send({ error: e.message });
    }
  },
};

const rOrderById = {
  method: "GET",
  url: "/orders/:id",
  handler: async function (request, reply) {
    try {
      const { db } = request;
      const { id } = request.params;
      await db.read();
      if (!db.data.orders) {
        reply.send({ order: [] });
        return;
      }

      const order = db.data.orders.find((order) => order.id === id);
      if (!order) {
        reply.send({ order: {} });
        return;
      }
      reply.send({ order });
    } catch (e) {
      reply.send({ error: e.message });
    }
  },
};

const routes = [rPizza, rOrders, rOrderById, rAddOrder];
export default routes;
