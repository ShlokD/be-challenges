export const getOrders = async (params) => {
  const start = params?.begindate
    ? new Date(params?.begindate).getTime()
    : -Infinity;
  const end = params?.enddate ? new Date(params?.enddate).getTime() : Infinity;
  const res = await fetch("https://www.mocky.io/v2/5817803a1000007d01cc7fc9");
  const json = await res.json();
  const orders = json.filter((result) => {
    const timestamp = new Date(result.date).getTime();
    return timestamp >= start && timestamp <= end;
  });
  return orders;
};

const rOrders = {
  method: "GET",
  url: "/b2w-orders",
  handler: async function (request, reply) {
    try {
      const { begindate, enddate } = request.query;
      const orders = await getOrders({ begindate, enddate });
      reply.send({ orders });
    } catch (e) {
      reply.send({ error: e.message });
    }
  },
};

const routes = [rOrders];
export default routes;
