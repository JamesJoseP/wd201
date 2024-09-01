// models/todo.js
"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Todo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static async addTask(params) {
      return await Todo.create(params);
    }
    static async showList() {
      console.log("My Todo list \n");

      console.log("Overdue");
      // FILL IN HERE
      const overdueTodos = await Todo.overdue();
      overdueTodos.forEach((todo) => {
        console.log(todo.displayableString());
      });
      console.log("\n");

      console.log("Due Today");
      // FILL IN HERE
      const todayTodos = await Todo.dueToday();
      todayTodos.forEach((todo) => {
        console.log(todo.displayableString());
      });
      console.log("\n");

      console.log("Due Later");
      // FILL IN HERE
      const laterTodos = await Todo.dueLater();
      laterTodos.forEach((todo) => {
        console.log(todo.displayableString());
      });
    }

    static async overdue() {
      // FILL IN HERE TO RETURN OVERDUE ITEMS
      const { Op } = require("sequelize");
      const today = new Date().toISOString().split("T")[0];
      // console.log(`Overdue query - Today: ${today}`);
      const overdueTodos = await Todo.findAll({
        where: {
          dueDate: {
            [Op.lt]: today,
          },
        },
      });
      // console.log("Overdue Todos:", overdueTodos);
      return overdueTodos;
    }

    static async dueToday() {
      // FILL IN HERE TO RETURN ITEMS DUE tODAY
      const { Op } = require("sequelize");
      const today = new Date().toISOString().split("T")[0];
      // console.log(`Due Today query - Today: ${today}`);
      const todayTodos = await Todo.findAll({
        where: {
          dueDate: {
            [Op.eq]: today,
          },
        },
      });
      // console.log("Due today: ", todayTodos);
      return todayTodos;
    }

    static async dueLater() {
      // FILL IN HERE TO RETURN ITEMS DUE LATER
      const { Op } = require("sequelize");
      const today = new Date().toISOString().split("T")[0];
      // console.log(`Due Later query - Today: ${today}`);
      const laterTodos = await Todo.findAll({
        where: {
          dueDate: {
            [Op.gt]: today,
          },
          completed: false,
        },
      });
      // console.log("Later Todos:", laterTodos);
      return laterTodos;
    }

    static async markAsComplete(id) {
      // FILL IN HERE TO MARK AN ITEM AS COMPLETE
      const todo = await Todo.findByPk(id);
      if (todo) {
        todo.completed = true;
        await todo.save();
      }
    }

    displayableString() {
      let checkbox = this.completed ? "[x]" : "[ ]";
      if (this.dueDate === new Date().toISOString().slice(0, 10)) {
        return `${this.id}. ${checkbox} ${this.title}`;
      } else {
        return `${this.id}. ${checkbox} ${this.title} ${this.dueDate}`;
      }
    }
  }
  Todo.init(
    {
      title: DataTypes.STRING,
      dueDate: DataTypes.DATEONLY,
      completed: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Todo",
    }
  );
  return Todo;
};

// ----------------------------------------------------------------
// BEFORE L5 MILESTONE

// "use strict";
// const { Model } = require("sequelize");
// module.exports = (sequelize, DataTypes) => {
//   class Todo extends Model {
//     /**
//      * Helper method for defining associations.
//      * This method is not a part of Sequelize lifecycle.
//      * The `models/index` file will call this method automatically.
//      */
//     static async addTask(params) {
//       return await Todo.create(params);
//     }
//     static associate(models) {
//       // define association here
//     }
//     displayableString() {
//       let checkbox = this.completed ? "[x]" : "[ ]";
//       return `${this.id}. ${checkbox} ${this.title} ${this.dueDate}`;
//     }
//   }
//   Todo.init(
//     {
//       title: DataTypes.STRING,
//       dueDate: DataTypes.DATEONLY,
//       completed: DataTypes.BOOLEAN,
//     },
//     {
//       sequelize,
//       modelName: "Todo",
//     }
//   );
//   return Todo;
// };
