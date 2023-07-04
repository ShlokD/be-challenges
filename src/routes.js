import addisonUserToken from "./addison-user-token/index.js";
import alayaTodos from "./alaya-todo-list/index.js";
import ambulunzPizza from "./ambulnz-pizza/index.js";
import b2wOrders from "./b2w-orders/index.js";

const routes = [
  ...addisonUserToken,
  ...alayaTodos,
  ...ambulunzPizza,
  ...b2wOrders,
];

export default routes;
