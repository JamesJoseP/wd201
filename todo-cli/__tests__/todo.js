/* eslint-disable no-undef */
const db = require("../models");

const getJSDate = (days) => {
  if (!Number.isInteger(days)) {
    throw new Error("Need to pass an integer as days");
  }
  const today = new Date();
  const oneDay = 60 * 60 * 24 * 1000;
  return new Date(today.getTime() + days * oneDay);
};

describe("Tests for functions in todo.js", function () {
  beforeAll(async () => {
    await db.sequelize.sync({ force: true });
  });

  test("Todo.overdue should return all tasks (including completed ones) that are past their due date", async () => {
    const todo = await db.Todo.addTask({
      title: "This is a sample item",
      dueDate: getJSDate(-2),
      completed: false,
    });
    const items = await db.Todo.overdue();
    expect(items.length).toBe(1);
  });

  test("Todo.dueToday should return all tasks that are due today (including completed ones)", async () => {
    const dueTodayItems = await db.Todo.dueToday();
    const todo = await db.Todo.addTask({
      title: "This is a sample item",
      dueDate: getJSDate(0),
      completed: false,
    });
    const items = await db.Todo.dueToday();
    expect(items.length).toBe(dueTodayItems.length + 1);
  });

  test("Todo.dueLater should return all tasks that are due on a future date (including completed ones)", async () => {
    const dueLaterItems = await db.Todo.dueLater();
    const todo = await db.Todo.addTask({
      title: "This is a sample item",
      dueDate: getJSDate(2),
      completed: false,
    });
    const items = await db.Todo.dueLater();
    expect(items.length).toBe(dueLaterItems.length + 1);
  });

  test("Todo.markAsComplete should change the `completed` property of a todo to `true`", async () => {
    const overdueItems = await db.Todo.overdue();
    const aTodo = overdueItems[0];
    expect(aTodo.completed).toBe(false);
    await db.Todo.markAsComplete(aTodo.id);
    await aTodo.reload();

    expect(aTodo.completed).toBe(true);
  });

  test("For a completed past-due item, Todo.displayableString should return a string of the format `ID. [x] TITLE DUE_DATE`", async () => {
    const overdueItems = await db.Todo.overdue();
    const aTodo = overdueItems[0];
    expect(aTodo.completed).toBe(true);
    const displayValue = aTodo.displayableString();
    expect(displayValue).toBe(
      `${aTodo.id}. [x] ${aTodo.title} ${aTodo.dueDate}`
    );
  });

  test("For an incomplete todo in the future, Todo.displayableString should return a string of the format `ID. [ ] TITLE DUE_DATE`", async () => {
    const dueLaterItems = await db.Todo.dueLater();
    const aTodo = dueLaterItems[0];
    expect(aTodo.completed).toBe(false);
    const displayValue = aTodo.displayableString();
    expect(displayValue).toBe(
      `${aTodo.id}. [ ] ${aTodo.title} ${aTodo.dueDate}`
    );
  });

  test("For an incomplete todo due today, Todo.displayableString should return a string of the format `ID. [ ] TITLE` (date should not be shown)", async () => {
    const dueTodayItems = await db.Todo.dueToday();
    const aTodo = dueTodayItems[0];
    expect(aTodo.completed).toBe(false);
    const displayValue = aTodo.displayableString();
    expect(displayValue).toBe(`${aTodo.id}. [ ] ${aTodo.title}`);
  });

  test("For a complete todo due today, Todo.displayableString should return a string of the format `ID. [x] TITLE` (date should not be shown)", async () => {
    const dueTodayItems = await db.Todo.dueToday();
    const aTodo = dueTodayItems[0];
    expect(aTodo.completed).toBe(false);
    await db.Todo.markAsComplete(aTodo.id);
    await aTodo.reload();
    const displayValue = aTodo.displayableString();
    expect(displayValue).toBe(`${aTodo.id}. [x] ${aTodo.title}`);
  });
});

//-------------------------------------------------------------
//ABOVE CODE IS FROM MILESTONE TEMPLATE

/* eslint-disable no-undef */
// const todoList = require("../todo");
// const db = require("../models");

// const { all, markAsComplete, add } = todoList();

// describe("ToDoList Test Suite", () => {
//   beforeAll(async () => {
//     await db.sequelize.sync({ force: true });
//   });
//   test("Should add new todo", async () => {
//     const todoItemsCount = await db.Todo.count();
//     await db.Todo.addTask({
//       title: "Test todo",
//       completed: false,
//       dueDate: new Date(),
//     });
//     const newTodoItemsCount = await db.Todo.count();
//     expect(newTodoItemsCount).toBe(todoItemsCount + 1);
//   });
// });

//   test("Should mark a todo as complete", () => {
//     expect(all[0].completed).toBe(false);
//     markAsComplete(0);
//     expect(all[0].completed).toBe(true);
//   });
//   // MY CODE BELOW

//   test("Should check overdue items", () => {
//     const overdueDate = new Date(new Date().setDate(new Date().getDate() - 1));
//     const overdueItemsCount = all.filter(
//       (item) => item.dueDate < new Date().toISOString().slice(0, 10)
//     ).length;
//     add({
//       title: "Test",
//       completed: false,
//       dueDate: overdueDate.toISOString().slice(0, 10),
//     });
//     expect(
//       all.filter((item) => item.dueDate < new Date().toISOString().slice(0, 10))
//         .length
//     ).toBe(overdueItemsCount + 1);
//   });

//   test("Should check dueToday items", () => {
//     const dueTodayCount = all.filter(
//       (item) => item.dueDate === new Date().toISOString().slice(0, 10)
//     ).length;
//     add({
//       title: "Learn coding",
//       completed: false,
//       dueDate: new Date().toISOString().slice(0, 10),
//     });
//     expect(
//       all.filter(
//         (item) => item.dueDate === new Date().toISOString().slice(0, 10)
//       ).length
//     ).toBe(dueTodayCount + 1);
//   });
//   test("Due later items", () => {
//     const dueLaterDate = new Date(new Date().setDate(new Date().getDate() + 1));
//     const dueLaterCount = all.filter(
//       (item) => item.dueDate > new Date().toISOString().slice(0, 10)
//     ).length;
//     add({
//       title: "Drink Tea",
//       completed: false,
//       dueDate: dueLaterDate.toISOString().slice(0, 10),
//     });
//     expect(
//       all.filter((item) => item.dueDate > new Date().toISOString().slice(0, 10))
//     ).toHaveLength(dueLaterCount + 1);
//   });
// });
