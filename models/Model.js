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
    imageSrc:{type: DataTypes.STRING},
    password: {type: DataTypes.STRING, allowNull: false}
    });

const Event = dbSequelize.define('event',{
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, allowNull: false},
    start_time: {type: DataTypes.DATE, allowNull: false},
    end_time: {type: DataTypes.DATE, allowNull: false},
    description: {type: DataTypes.TEXT}
})

const EventUsher = dbSequelize.define('event_usher',{
})

const Ticket = dbSequelize.define('ticket',{
    ticket: {type: DataTypes.STRING, primaryKey: true},
    status: {type: DataTypes.STRING},
    description: {type: DataTypes.TEXT},
    email: {type: DataTypes.STRING, allowNull: false}

})

const Categ = dbSequelize.define('categ',{
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name:{type: DataTypes.STRING},
    number:{type: DataTypes.INTEGER},
    description: {type: DataTypes.TEXT},
    status:{type: DataTypes.STRING}
})

Manager.hasMany(Usher,{allowNull: false, onDelete: 'cascade'});
Manager.hasMany(Event,{allowNull: false, onDelete: 'cascade'});
Usher.belongsToMany(Event, {through: EventUsher, onDelete: 'cascade'});
Event.belongsToMany(Usher, {through: EventUsher ,onDelete: 'cascade'});
Event.hasMany(Categ, {allowNull: true, onDelete: 'cascade'});
Categ.hasMany(Ticket, {allowNull: true, onDelete: 'cascade'});


module.exports = {
    Manager,
    Usher,
    Event,
    EventUsher,
    Ticket,
    Categ,
    dbSequelize
};

