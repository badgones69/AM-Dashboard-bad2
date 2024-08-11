const db = require('../index');
const Route = db.routes;

exports.findAll = (req, res) => {
  Route.findAll({
    include: [{model: db.airports, as: 'departureHub'}, {
      model: db.airports,
      as: 'arrivalAirport'
    }]
  }).then(data => {
    res.send(data);
  }).catch(err => {
    res.status(500).send({
      message: err.message || 'Server error during routes retrieve'
    });
  });
};
