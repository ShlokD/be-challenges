const rAddToDo = {
  method: "POST",
  url: "/alaya-add-todo",
  handler: async function (request, reply) {
    try {
      const body = request.body;
      if (!body) {
        throw new Error("Missing body");
      }
      const { description, user } = body;
      if (!description) {
        throw new Error("Missing description");
      }

      if (!user) {
        throw new Error("Missing user id");
      }

      const db = request.db;
      await db.read();
      if (!db.data.todos) {
        db.data.todos = [];
      }
      const last = db.data.todos[db.data.todos.length - 1];
      const id = (last?.id || 0) + 1;
      db.data.todos.push({
        id,
        user,
        description,
        done: false,
      });
      await db.write();
      reply.send({ msg: "OK", id });
    } catch (e) {
      reply.send({ error: e.message });
    }
  },
};

const rDeleteTodo = {
  method: "DELETE",
  url: "/alaya-del-todo",
  handler: async function (request, reply) {
    try {
      const body = request.body;
      if (!body) {
        throw new Error("Missing body");
      }
      const { id } = body;
      if (!id) {
        throw new Error("Missing id");
      }

      const db = request.db;
      await db.read();

      if (!db.data.todos) {
        throw new Error("No todos found");
      }

      const todos = db.data.todos.filter((todo) => todo.id !== id);
      db.data.todos = [...todos];
      await db.write();
      reply.send({ msg: "DELETED", id });
    } catch (e) {
      reply.send({ error: e.message });
    }
  },
};

const rCompleteTodo = {
  method: "PUT",
  url: "/alaya-complete-todo",
  handler: async function (request, reply) {
    try {
      const body = request.body;
      if (!body) {
        throw new Error("Missing body");
      }
      const { user, id } = body;
      if (!user) {
        throw new Error("Missing user id");
      }
      if (!id) {
        throw new Error("Missing id");
      }

      const db = request.db;
      await db.read();

      if (!db.data.todos) {
        throw new Error("No todos found");
      }

      const todoIndex = db.data.todos.findIndex(
        (todo) => todo.id === id && todo.user === user
      );
      if (todoIndex === -1) {
        throw new Error("Todo not found");
      }
      if (!db.data.todos[todoIndex].done) {
        db.data.todos[todoIndex].done = true;
        await db.write();
      }

      reply.send({ msg: "OK", todo: db.data.todos[todoIndex] });
    } catch (e) {
      reply.send({ error: e.message });
    }
  },
};

const rViewTodo = {
  method: "GET",
  url: "/alaya-todo/:userid/:todoid",
  handler: async function (request, reply) {
    try {
      const { db } = request;
      await db.read();
      const { userid, todoid } = request.params;
      const iTodoId = parseInt(todoid);
      if (!db.data.todos) {
        throw new Error("Todo not found");
      }
      await db.read();
      const todo = db.data.todos.find(
        (todo) => todo.id === iTodoId && todo.user === userid
      );
      if (!todo) {
        throw new Error("Todo not found");
      }
      reply.send({ todo });
    } catch (e) {
      reply.send({ error: e.message });
    }
  },
};

const PAGE_SIZE = 3;

const rTodoList = {
  method: "GET",
  url: "/alaya-todolist/:userid/:page",
  handler: async function (request, reply) {
    try {
      const { userid, page } = request.params;
      const { db } = request;
      await db.read();
      if (!db.data.todos) {
        throw new Error("Todos not found");
      }
      const pageNum = parseInt(page);
      const pages = Math.ceil(db.data.todos.length / PAGE_SIZE);
      if (pageNum > pages) {
        reply.send({ todos: [], pages });
        return;
      }

      let todos = db.data.todos.filter((todo) => todo.user === userid);
      const indices = new Set(
        new Array(PAGE_SIZE).fill(0).map((_, i) => PAGE_SIZE * pageNum - i)
      );
      todos = todos.filter((_, index) => indices.has(index + 1));
      reply.send({ todos, pages });
    } catch (e) {
      reply.send({ error: e.message });
    }
  },
};
const routes = [rAddToDo, rViewTodo, rCompleteTodo, rTodoList, rDeleteTodo];
export default routes;
