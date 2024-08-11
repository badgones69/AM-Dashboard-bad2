const db = require('../index');
const Airline = db.airlines;
const Op = db.Sequelize.Op;

exports.findOne = (req, res) => {
  let condition = {id: {[Op.eq]: parseInt(req.params.id)}};
  Airline.findOne({where: condition}).then(data => {
    res.send(data);
  }).catch(err => {
    res.status(500).send({
      message: err.message || 'Server error during airline retrieve'
    });
  });
};
