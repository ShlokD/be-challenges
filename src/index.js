import Fastify from "fastify";
import routes from "../routes.js";

const fastify = Fastify({
  logger: true,
});

routes.forEach((route) => {
  fastify.route(route);
});

fastify.listen({ port: 3000 }, function (err) {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
});
