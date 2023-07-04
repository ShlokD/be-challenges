import { fastify } from "../../app.js";
import supertest from "supertest";
import { jest } from "@jest/globals";

afterAll(() => fastify.close());

const data = {
  results: [{ name: "tauros" }],
};

describe("PokeAPI", () => {
  beforeEach(() => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve(data),
      })
    );
  });
  it("GET `/poke-create` route", async () => {
    await fastify.ready();

    const response = await supertest(fastify.server)
      .get("/poke-create")
      .expect(200)
      .expect("Content-Type", "application/json; charset=utf-8");

    expect(response.body.result.first).toEqual("tauros");
    expect(response.body.result.second).toEqual("tauros");
  });

  it("GET `/poke-show` route", async () => {
    await fastify.ready();
    const server = supertest(fastify.server);

    const response1 = await server
      .get("/poke-create")
      .expect(200)
      .expect("Content-Type", "application/json; charset=utf-8");

    const response2 = await server
      .get(`/poke-show?id=${response1.body.result.id}`)
      .expect(200)
      .expect("Content-Type", "application/json; charset=utf-8");

    expect(response2.body.result.winner).toEqual("tauros");
  });

  it("GET `/poke-index` route", async () => {
    await fastify.ready();
    const server = supertest(fastify.server);

    const response = await server
      .get("/poke-index")
      .expect(200)
      .expect("Content-Type", "application/json; charset=utf-8");

    expect(response.body.results).toHaveLength(2);
  });
});
