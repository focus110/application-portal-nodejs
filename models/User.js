const db = require("../db/db");
const Sequelize = require("sequelize");
const { v4: uuidv4 } = require("uuid");

const User = db.define("users", {
  id: {
    type: Sequelize.DataTypes.UUID,
    defaultValue: function () {
      return uuidv4();
    },
    primaryKey: true,
  },
  firstname: {
    type: Sequelize.STRING,
    allowNull: false,
    validator: {
      notEmpty: true,
    },
    defaultValue: "",
  },
  lastname: {
    type: Sequelize.STRING,
    allowNull: false,
    validator: {
      notEmpty: true,
    },
    defaultValue: "",
  },
  username: {
    type: Sequelize.STRING,
    allowNull: false,
    validator: {
      notEmpty: true,
    },
    defaultValue: "",
  },
  gender: {
    type: Sequelize.STRING,
    allowNull: false,
    validator: {
      notEmpty: true,
    },
    defaultValue: "",
  },
  role: {
    type: Sequelize.STRING,
    allowNull: false,
    validator: {
      notEmpty: true,
    },
    defaultValue: "student",
  },
  course: {
    type: Sequelize.JSON,
    allowNull: false,
    validator: {
      notEmpty: true,
    },
    defaultValue: {},
  },
  accountStatus: {
    type: Sequelize.STRING,
    allowNull: false,
    validator: {
      notEmpty: true,
    },
    defaultValue: "active",
  },
  verified: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    validator: {
      notEmpty: true,
    },
    defaultValue: false,
  },
  paymentStatus: {
    type: Sequelize.STRING,
    allowNull: false,
    validator: {
      notEmpty: true,
    },
    defaultValue: "pending",
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    validator: {
      notEmpty: true,
    },
    defaultValue: "",
  },
  phone: {
    type: Sequelize.STRING,
    allowNull: false,
    validator: {
      notEmpty: true,
    },
    defaultValue: "",
  },
  profileImg_id: {
    type: Sequelize.STRING,
    allowNull: false,
    validator: {
      notEmpty: true,
    },
    defaultValue: "",
  },
  programme: {
    type: Sequelize.STRING,
    allowNull: false,
    validator: {
      notEmpty: true,
    },
    defaultValue: "",
  },
  department: {
    type: Sequelize.STRING,
    allowNull: false,
    validator: {
      notEmpty: true,
    },
    defaultValue: "",
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false,
    validator: {
      notEmpty: true,
    },
    defaultValue: "",
  },
});

module.exports = User;
