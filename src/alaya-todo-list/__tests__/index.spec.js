import { fastify } from "../../app.js";
import supertest from "supertest";

afterAll(() => fastify.close());

it("POST `/alaya-add-todo` route", async () => {
  await fastify.ready();

  const response = await supertest(fastify.server)
    .post("/alaya-add-todo")
    .send({ user: "abc", description: "hello" })
    .expect(200)
    .expect("Content-Type", "application/json; charset=utf-8");

  expect(response.body).toEqual({ msg: "OK", id: 1 });
});

it("GET `/alaya-todo` route", async () => {
  await fastify.ready();

  const response = await supertest(fastify.server)
    .get("/alaya-todo/abc/1")
    .expect(200)
    .expect("Content-Type", "application/json; charset=utf-8");

  expect(response.body.todo).toEqual({
    id: 1,
    description: "hello",
    user: "abc",
    done: false,
  });
});

it("PUT `/alaya-complete-todo` route", async () => {
  await fastify.ready();

  const response = await supertest(fastify.server)
    .put("/alaya-complete-todo")
    .send({ user: "abc", id: 1 })
    .expect(200)
    .expect("Content-Type", "application/json; charset=utf-8");

  expect(response.body.todo).toEqual({
    id: 1,
    description: "hello",
    user: "abc",
    done: true,
  });
});

it("DELETE `/alaya-del-todo` route", async () => {
  await fastify.ready();

  const response = await supertest(fastify.server)
    .delete("/alaya-del-todo")
    .send({ user: "abc", id: 1 })
    .expect(200)
    .expect("Content-Type", "application/json; charset=utf-8");

  expect(response.body).toEqual({
    msg: "DELETED",
    id: 1,
  });
});

it("GET `/alaya-todolist` route", async () => {
  await fastify.ready();
  const server = supertest(fastify.server);

  await server
    .post("/alaya-add-todo")
    .send({ user: "abc", description: "a" })
    .expect(200)
    .expect("Content-Type", "application/json; charset=utf-8");

  await server
    .post("/alaya-add-todo")
    .send({ user: "abc", description: "b" })
    .expect(200)
    .expect("Content-Type", "application/json; charset=utf-8");

  await server
    .post("/alaya-add-todo")
    .send({ user: "abc", description: "c" })
    .expect(200)
    .expect("Content-Type", "application/json; charset=utf-8");

  await server
    .post("/alaya-add-todo")
    .send({ user: "abc", description: "d" })
    .expect(200)
    .expect("Content-Type", "application/json; charset=utf-8");

  const res1 = await server.get("/alaya-todolist/abc/1");
  expect(res1.body.todos).toHaveLength(3);

  const res2 = await server.get("/alaya-todolist/abc/2");
  expect(res2.body.todos).toHaveLength(1);
});
