import { fastify } from "../../app.js";
import supertest from "supertest";

afterAll(() => fastify.close());

it("GET `/pizza` route", async () => {
  await fastify.ready();

  const response = await supertest(fastify.server)
    .get("/pizza")
    .expect(200)
    .expect("Content-Type", "application/json; charset=utf-8");

  expect(response.body).toEqual([
    {
      name: "Margherita",
      price: 5,
      ingredients: ["tomato", "mozzarella"],
    },
    {
      name: "Bufala",
      price: 6,
      ingredients: ["tomato", "mozarella di bufala"],
    },
    {
      name: "Romana",
      price: 5,
      ingredients: ["tomato", "mozzarella", "anchovies", "oregano", "oil"],
    },
    {
      name: "Diavola",
      price: 7.5,
      ingredients: ["tomato", "mozzarella", "spicy salami"],
    },
    {
      name: "Pizza Bianca",
      price: 5,
      ingredients: ["mozzarella", "oregano"],
    },
  ]);
});

it("POST `/add-order` route", async () => {
  await fastify.ready();

  const response = await supertest(fastify.server)
    .post("/add-order")
    .send({ name: "margherita" })
    .expect(200)
    .expect("Content-Type", "application/json; charset=utf-8");

  expect(response.body.msg).toEqual("OK");
});

it("GET `/orders` route", async () => {
  await fastify.ready();
  const server = supertest(fastify.server);

  const response = await server
    .post("/add-order")
    .send({ name: "margherita" })
    .expect(200)
    .expect("Content-Type", "application/json; charset=utf-8");

  const id = response.body.id;
  expect(response.body.msg).toEqual("OK");

  const response2 = await server
    .get(`/orders/${id}`)
    .expect(200)
    .expect("Content-Type", "application/json; charset=utf-8");
  expect(response2.body.order.pizza.name).toEqual("Margherita");

  const response3 = await server
    .get(`/orders/3`)
    .expect(200)
    .expect("Content-Type", "application/json; charset=utf-8");
  expect(response3.body).toEqual({ order: {} });
});

it("GET `/orders` route", async () => {
  await fastify.ready();
  const server = supertest(fastify.server);

  const response = await server
    .post("/add-order")
    .send({ name: "margherita" })
    .expect(200)
    .expect("Content-Type", "application/json; charset=utf-8");

  expect(response.body.msg).toEqual("OK");

  const response2 = await server
    .get(`/orders`)
    .expect(200)
    .expect("Content-Type", "application/json; charset=utf-8");
  expect(response2.body.orders.length).toEqual(3);
});
