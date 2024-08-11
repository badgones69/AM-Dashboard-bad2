module.exports = app => {
  const airports = require('../queries/airport');
  let router = require('express').Router();

  router.get('', airports.findAll);
  router.get('/hubs', airports.findHubs);
  router.get('/:id', airports.findOne);
  router.post('', airports.create);
  router.put('/:id', airports.update);
  router.delete('/:id', airports.delete);
  app.use('/airports', router);
};
