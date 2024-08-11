module.exports = app => {
  const airlines = require('../queries/airline');
  let router = require('express').Router();

  router.get('/:id', airlines.findOne);
  app.use('/airlines', router);
};
