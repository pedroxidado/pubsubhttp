require('dotenv').config()

const express = require('express');
const app = express();
const mongoose =  require('mongoose');
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json({type: 'application/json'}));

app.get('/ping', function(req, res) {
  const pingResponse = res.send({ status: 'Server is up & running!'});
  res.end();
  return pingResponse;
});

//connect to DB
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log('connected to database'))

//set up subscribe endpoints
const subRoutes = require('../api/subscribe/routes/subRoutes');
app.use('/subscribe', subRoutes);

//set up publisher endpoints
const pubRoutes = require('../api/publish/routes/pubRoutes');
app.use('/publish', pubRoutes);


//set up test route
const testRoutes = require('../api/event/routes/eventRoutes');
app.use('/event', testRoutes);

app.use((req, res, next) => {
  res.status(404).send({ error: `${req.originalUrl} not found`});
  next();
});

module.exports = app;