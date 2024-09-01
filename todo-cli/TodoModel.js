const { Sequelize, DataTypes, Model } = require("sequelize");
const { sequelize } = require("./connectDB");

class Todo extends Model {
  // STATIC METHOD
  static async addTask(params) {
    return await Todo.create(params);
  }
  // INSTANCE METHOD
  displayableString() {
    return `${this.completed ? "[x]" : "[ ]"} ${this.id}. ${this.title} - ${this.dueDate}`;
  }
}

Todo.init(
  {
    // Model attributes are defined here
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    dueDate: {
      type: DataTypes.DATEONLY,
    },
    completed: {
      type: DataTypes.BOOLEAN,
    },
  },
  {
    sequelize, // pass the connection instance
  }
);

module.exports = Todo;
Todo.sync();
