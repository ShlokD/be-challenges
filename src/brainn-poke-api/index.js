import { v4 } from "uuid";

const randomOffset = () => Math.floor(Math.random() * 1000);

const fetchPokemon = async () => {
  const res = await fetch(
    `https://pokeapi.co/api/v2/pokemon?limit=1&offset=${randomOffset()}`
  );
  const json = await res.json();
  return {
    name: json?.results[0]?.name,
  };
};
const rCreate = {
  method: "GET",
  url: "/poke-create",
  handler: async function (request, reply) {
    try {
      const db = request.db;
      await db.read();

      if (!db.data.battles) {
        db.data.battles = [];
      }

      const [poke1, poke2] = await Promise.all([
        await fetchPokemon(),
        await fetchPokemon(),
      ]);

      const result = {
        id: v4(),
        first: poke1.name,
        second: poke2.name,
      };
      db.data.battles.push({
        ...result,
        winner:
          Math.floor(Math.random() * 10) % 2 === 0 ? poke1.name : poke2.name,
      });
      await db.write();
      reply.send({ result });
    } catch (e) {
      reply.send({ error: e.message });
    }
  },
};

const rShow = {
  method: "GET",
  url: "/poke-show",
  handler: async function (request, reply) {
    try {
      const db = request.db;
      await db.read();
      if (!db.data.battles) {
        db.data.battles = [];
      }
      const { id } = request.query;
      if (!id) {
        throw new Error("Enter battle id");
      }
      const result = db.data.battles.find((battle) => battle.id === id);
      reply.send({ result: result });
    } catch (e) {
      reply.send({ error: e.message });
    }
  },
};

const rIndex = {
  method: "GET",
  url: "/poke-index",
  handler: async function (request, reply) {
    try {
      const db = request.db;
      await db.read();
      if (!db.data.battles) {
        db.data.battles = [];
      }
      reply.send({ results: db.data.battles });
    } catch (e) {
      reply.send({ error: e.message });
    }
  },
};

const routes = [rCreate, rShow, rIndex];
export default routes;
