module.exports = (sequelize, Sequelize) => {
  return sequelize.define('airline', {
      id: {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false},
      icao: {type: Sequelize.CHAR(2), allowNull: false},
      name: {type: Sequelize.STRING, allowNull: false}
    },
    {timestamps: false});
};
