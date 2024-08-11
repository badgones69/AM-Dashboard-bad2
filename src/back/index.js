const dbConfig = require('./config');
const Sequelize = require('sequelize');

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.airlines = require('./models/airline')(sequelize, Sequelize);
db.airports = require('./models/airport')(sequelize, Sequelize);
db.routes = require('./models/route')(sequelize, Sequelize);

db.routes.belongsTo(db.airports, {as: 'departureHub'});
db.routes.belongsTo(db.airports, {as: 'arrivalAirport'});

module.exports = db;
