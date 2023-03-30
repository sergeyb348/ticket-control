const {Model, DataTypes} = require("sequelize")
const dbSequelize = require("../db.js")

const Manager = dbSequelize.define('manager', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, unique: true},
    email: {type: DataTypes.STRING, unique: true},
    password: {type: DataTypes.STRING}
    });

const Usher = dbSequelize.define('usher', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, unique: true},
    password: {type: DataTypes.STRING}
    });

module.exports = {
    Manager,
    Usher
};

