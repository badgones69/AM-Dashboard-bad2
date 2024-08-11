module.exports = (sequelize, Sequelize) => {
  return sequelize.define('route', {
      id: {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false}
    },
    {timestamps: false});
};
