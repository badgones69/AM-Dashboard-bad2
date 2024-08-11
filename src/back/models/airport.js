module.exports = (sequelize, Sequelize) => {
  return sequelize.define('airport', {
      id: {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false},
      iata: {type: Sequelize.CHAR(3), allowNull: false},
      name: {type: Sequelize.STRING(300)},
      city: {type: Sequelize.STRING(700), allowNull: false},
      countryId: {type: Sequelize.INTEGER, allowNull: false},
      regionId: {type: Sequelize.INTEGER},
      hub: {type: Sequelize.BOOLEAN, allowNull: false}
    },
    {timestamps: false});
};
