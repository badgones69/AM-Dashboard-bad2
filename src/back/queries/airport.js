const db = require('../index');
const Airport = db.airports;
const Op = db.Sequelize.Op;

exports.findHubs = async (req, res) => {
  let condition = {hub: {[Op.eq]: true}};
  Airport.findAll({where: condition}).then(data => {
    res.send(data);
  }).catch(err => {
    res.status(500).send({
      message: err.message || 'Server error during hubs airports retrieve'
    });
  });
};

exports.findAll = (req, res) => {
  Airport.findAll().then(data => {
    res.send(data);
  }).catch(err => {
    res.status(500).send({
      message: err.message || 'Server error during airports retrieve'
    });
  });
};

exports.findOne = (req, res) => {
  let condition = {id: {[Op.eq]: parseInt(req.params.id)}};
  Airport.findOne({where: condition}).then(data => {
    res.send(data);
  }).catch(err => {
    res.status(500).send({
      message: err.message || 'Server error during airline retrieve'
    });
  });
};

exports.create = (req, res) => {
  if (!req.body.iata || !req.body.city || !req.body.countryId | !req.body.hub) {
    res.status(400).send({
      message: 'Some required attributes are empty'
    });
    return;
  }

  const airport = {
    iata: req.body.iata,
    name: req.body.name,
    city: req.body.city,
    countryId: req.body.countryId,
    regionId: req.body.regionId,
    hub: req.body.hub,
  };

  Airport.create(airport).then(data => {
    res.send(data);
  }).catch(err => {
    res.status(500).send({
      message: err.message || 'Server error during airport creation'
    });
  });
};

exports.update = (req, res) => {
  if (!req.body.iata || !req.body.city || !req.body.countryId | !req.body.hub) {
    res.status(400).send({
      message: 'Some required attributes are empty'
    });
    return;
  }

  let condition = {id: {[Op.eq]: parseInt(req.params.id)}};
  const airport = {
    iata: req.body.iata,
    name: req.body.name,
    city: req.body.city,
    countryId: req.body.countryId,
    regionId: req.body.regionId,
    hub: req.body.hub,
  };

  Airport.update(airport, {where: condition}).then(data => {
    res.send(data);
  }).catch(err => {
    res.status(500).send({
      message: err.message || 'Server error during airport update'
    });
  });
};

exports.delete = (req, res) => {
  let condition = {id: {[Op.eq]: parseInt(req.params.id)}};
  Airport.destroy({where: condition}).then()
    .catch(err => {
      res.status(500).send({
        message: err.message || 'Server error during airport delete'
      });
    });
};
