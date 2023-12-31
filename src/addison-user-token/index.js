import { issueToken, requestToken } from "./token.js";
import { user } from "./user.js";

const sleep = async () => {
  await new Promise((resolve) => setTimeout(resolve, Math.random() * 5000));
};

const issueTokenRoute = {
  method: "POST",
  url: "/addison-issue-token",
  handler: async function (request, reply) {
    try {
      const body = request.body;
      if (!body) {
        throw new Error("Missing body");
      }
      const { userId } = body;
      await sleep();
      const token = await issueToken(userId);
      reply.send(token);
    } catch (e) {
      reply.send({ error: e.message });
    }
  },
};

const requestTokenRoute = {
  method: "POST",
  url: "/addison-request-token",
  handler: async function (request, reply) {
    try {
      const body = request.body;
      if (!body) {
        throw new Error("Missing body");
      }
      const { username, password } = body;
      await sleep();

      const token = await requestToken({ username, password });
      reply.send(token);
    } catch (e) {
      reply.send({ error: e.message });
    }
  },
};

const userRoute = {
  method: "POST",
  url: "/addison-user",
  handler: async function (request, reply) {
    try {
      const body = request.body;
      if (!body) {
        throw new Error("Missing body");
      }
      const { username, password } = body;
      await sleep();

      const userDetails = await user({ username, password });
      reply.send(userDetails);
    } catch (e) {
      reply.send({ error: e.message });
    }
  },
};

const routes = [issueTokenRoute, requestTokenRoute, userRoute];
export default routes;
