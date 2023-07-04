import Fastify from "fastify";
import routes from "./routes.js";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import multipart from "@fastify/multipart";

import { Low, MemorySync } from "lowdb";
import { JSONFile } from "lowdb/node";

// db.json file path
const __dirname = dirname(fileURLToPath(import.meta.url));
const file = join(__dirname, "../db.json");

// Configure lowdb to write data to JSON file
const adapter =
  process.env.NODE_ENV === "test" ? new MemorySync() : new JSONFile(file);
const defaultData = {};
const db = new Low(adapter, defaultData);

export const fastify = Fastify({
  logger: process.env.NODE_ENV !== "test",
});

fastify.decorateRequest("db", db);
fastify.register(multipart);

routes.forEach((route) => {
  fastify.route(route);
});
