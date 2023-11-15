const express = require("express");
const winston = require("winston");
const bodyParser = require("body-parser");

const app = express();//aplicatia mea


app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept, Authorization, x-auth-token'
  );
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, PUT');
  next();
});


// require('./startup/logging')();
require("./startup/routes")(app);
require("./startup/config")();
require("./startup/db")();

app.use((error, req, res, next) => {
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;

  res.status(status).json({message: message, data: data});
});  


const port = process.env.PORT || 8001;//aleg serveru
const server = app.listen(port, () =>
  winston.info(`Listening on port ${port}`)
);

module.exports = server;//deschid server
