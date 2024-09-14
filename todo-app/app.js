const express = require("express");
var csurf = require("tiny-csrf");
const app = express();
const { Todo } = require("./models");
const bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
const path = require("path");
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser("shh! some secret string"));
app.use(csurf("this_should_be_32_character_long", ["PUT", "POST", "DELETE"]));

// Set EJS as view engine
app.set("view engine", "ejs");

app.get("/", async (request, response) => {
  const today = new Date().toISOString().split("T")[0];
  const allTodos = await Todo.getTodos();
  const overdueTodos = allTodos.filter(
    (todo) => todo.dueDate < today && !todo.completed,
  );
  const dueTodayTodos = allTodos.filter(
    (todo) => todo.dueDate === today && !todo.completed,
  );
  const dueLaterTodos = allTodos.filter(
    (todo) => todo.dueDate > today && !todo.completed,
  );
  const completedTodos = allTodos.filter((todo) => todo.completed);

  if (request.accepts("html")) {
    response.render("index", {
      title: "Todo application",
      overdueTodos,
      dueTodayTodos,
      dueLaterTodos,
      completedTodos,
      csrfToken: request.csrfToken(),
    });
  } else {
    response.json({ overdueTodos, dueTodayTodos, dueLaterTodos });
  }
});

app.use(express.static(path.join(__dirname, "public")));

// define a route for this express.js application
// app.METHOD(PATH, HANDLER)
// or
// app.METHOD(PATH, callback [, callback ....])

app.get("/t", (request, response) => {
  response.send("hello world");
});

app.get("/todos", async function (_request, response) {
  console.log("Processing list of all Todos ...");
  // FILL IN YOUR CODE HERE
  try {
    const todos = await Todo.findAll();
    response.status(200).json(todos);
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }

  // First, we have to query our PostgreSQL database using Sequelize to get list of all Todos.
  // Then, we have to respond with all Todos, like:
  // response.send(todos)
});

// app.get("/todos", (request, response) => {
//   response.send("hello world");
//   console.log("Todo list");
//   console.log(request.body);
// });

app.get("/todos/:id", async function (request, response) {
  try {
    const todo = await Todo.findByPk(request.params.id);
    return response.json(todo);
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});

// app.post("/todos", async (request, response) => {
//   console.log("Creating a todo", request.body);
//   // Todo
//   try {
//     const todo = await Todo.addTodo({
//       title: request.body.title,
//       dueDate: request.body.dueDate,
//       completed: false,
//     });
//     return response.json(todo);
//   } catch (error) {
//     console.log(error);
//     return response.status(442).json(error);
//   }
// });

app.post("/todos", async function (request, response) {
  try {
    // const todo = await Todo.addTodo(request.body);
    // return response.json(todo);
    await Todo.addTodo(request.body);
    return response.redirect("/");
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});

app.put("/todos/:id", async (request, response) => {
  // console.log("We have to update a todo with IDs:", request.params.id);
  const todo = await Todo.findByPk(request.params.id);
  try {
    const updatedTodo = await todo.setCompletionStatus();
    return response.json(updatedTodo);
  } catch (error) {
    console.log(error);
    return response.status(442).json(error);
  }
});

app.delete("/todos/:id", async function (request, response) {
  console.log("We have to delete a Todo with ID: ", request.params.id);
  // FILL IN YOUR CODE HERE
  // try {
  //   const todo = await Todo.destroy({
  //     where: {
  //       id: request.params.id,
  //     },
  //   });
  //   if (todo) {
  //     response.status(200).json(true);
  //   } else {
  //     response.status(404).json(false);
  //   }
  // } catch (error) {
  //   console.log(error);
  //   return response.status(442).json(error);
  // }
  // First, we have to query our database to delete a Todo by ID.
  // Then, we have to respond back with true/false based on whether the Todo was deleted or not.
  // response.send(true)
  // ALTERNATIVE CODE BELOW:
  try {
    await Todo.remove(request.params.id);
    return response.json({ success: true });
  } catch (err) {
    return response.status(442).json(error);
  }
});

module.exports = app;
