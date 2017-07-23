var express = require("express");
var bodyParser = require("body-parser");
var load = require("express-load");
var Joi = require("joi");
var cors = require("cors");
const database = require("./database")();

module.exports = function () {
  var app = express();

  app.set("database",database);
  app.set("joi",Joi);
  app.set("port", process.env.PORT||3000);

  app.use(bodyParser.urlencoded({extended:true}));
  app.use(bodyParser.json());
  app.use(require("method-override")());
  app.use(cors());

  load("model",{cwd : 'app'}).then("controller").then("route").into(app);

  return app;
}
