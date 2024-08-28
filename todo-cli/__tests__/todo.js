/* eslint-disable no-undef */
const todoList = require("../todo");

const { all, markAsComplete, add } = todoList();

describe("ToDoList Test Suite", () => {
  beforeAll(() => {
    add({
      title: "Test todo",
      completed: false,
      dueDate: new Date().toISOString().slice(0, 10),
    });
  });
  test("Should add new todo", () => {
    const todoItemsCount = all.length;
    add({
      title: "Test todo",
      completed: false,
      dueDate: new Date().toISOString().slice(0, 10),
    });
    expect(all.length).toBe(todoItemsCount + 1);
  });
  test("Should mark a todo as complete", () => {
    expect(all[0].completed).toBe(false);
    markAsComplete(0);
    expect(all[0].completed).toBe(true);
  });
  // MY CODE BELOW

  test("Should check overdue items", () => {
    const overdueDate = new Date(new Date().setDate(new Date().getDate() - 1));
    const overdueItemsCount = all.filter(
      (item) => item.dueDate < new Date().toISOString().slice(0, 10)
    ).length;
    add({
      title: "Test",
      completed: false,
      dueDate: overdueDate.toISOString().slice(0, 10),
    });
    expect(
      all.filter((item) => item.dueDate < new Date().toISOString().slice(0, 10))
        .length
    ).toBe(overdueItemsCount + 1);
  });

  test("Should check dueToday items", () => {
    const dueTodayCount = all.filter(
      (item) => item.dueDate === new Date().toISOString().slice(0, 10)
    ).length;
    add({
      title: "Learn coding",
      completed: false,
      dueDate: new Date().toISOString().slice(0, 10),
    });
    expect(
      all.filter(
        (item) => item.dueDate === new Date().toISOString().slice(0, 10)
      ).length
    ).toBe(dueTodayCount + 1);
  });
  test("Due later items", () => {
    const dueLaterDate = new Date(new Date().setDate(new Date().getDate() + 1));
    const dueLaterCount = all.filter(
      (item) => item.dueDate > new Date().toISOString().slice(0, 10)
    ).length;
    add({
      title: "Drink Tea",
      completed: false,
      dueDate: dueLaterDate.toISOString().slice(0, 10),
    });
    expect(
      all.filter((item) => item.dueDate > new Date().toISOString().slice(0, 10))
    ).toHaveLength(dueLaterCount + 1);
  });
});
