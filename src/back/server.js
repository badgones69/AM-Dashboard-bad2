const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const db = require('./');

let corsOptions = {
  origin: "http://localhost:4200"
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

db.sequelize.sync();

app.get('/', (req, res) => {
  res.json({message: 'Welcome !!!'})
});

require('./services/airline')(app);
require('./services/airport')(app);
require('./services/route')(app);

app.listen(3000, () => {
  console.log('server is running on port 3000');
});
