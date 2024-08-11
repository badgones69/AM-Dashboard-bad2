module.exports = app => {
  const routes = require('../queries/route');
  let router = require('express').Router();

  router.get('', routes.findAll);
  app.use('/routes', router);
};
