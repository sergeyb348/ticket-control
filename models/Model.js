const {Model, DataTypes} = require("sequelize")
const dbSequelize = require("../db.js")

const Manager = dbSequelize.define('manager', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, unique: true, allowNull: false},
    email: {type: DataTypes.STRING, unique: true, allowNull: false},
    password: {type: DataTypes.STRING, allowNull: false}
    });

const Usher = dbSequelize.define('usher', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    email: {type: DataTypes.STRING, unique: true, allowNull: false},
    firstName: {type: DataTypes.STRING, allowNull: false},
    lastName: {type: DataTypes.STRING},
    surname: {type: DataTypes.STRING},
    password: {type: DataTypes.STRING, allowNull: false}
    });

Manager.hasMany(Usher,{allowNull: false});

module.exports = {
    Manager,
    Usher
};

