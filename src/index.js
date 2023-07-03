import Fastify from "fastify";
import routes from "./routes.js";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";

// db.json file path
const __dirname = dirname(fileURLToPath(import.meta.url));
const file = join(__dirname, "../db.json");

// Configure lowdb to write data to JSON file
const adapter = new JSONFile(file);
const defaultData = {};
const db = new Low(adapter, defaultData);

const fastify = Fastify({
  logger: true,
});

fastify.decorateRequest("db", db);

routes.forEach((route) => {
  fastify.route(route);
});

fastify.listen({ port: 3000 }, function (err) {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
});
