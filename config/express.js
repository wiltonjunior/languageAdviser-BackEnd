var express = require("express");
var bodyParser = require("body-parser");
var load = require("express-load");
var Joi = require("joi");
var cors = require("cors");
var hateoas = require("express-hateoas-links");
var fs = require("fs");
var formidable = require("formidable");
var hasha = require("hasha");
var path = require("path");
const database = require("./database")();

module.exports = function () {
  var app = express();

  app.set("database",database);
  app.set("joi",Joi);
  app.set("port", process.env.PORT||3000);
  app.set("fs",fs);
  app.set("formidable",formidable);
  app.set("hasha",hasha);
  app.set("path",path);

  app.use(bodyParser.urlencoded({extended:true}));
  app.use(bodyParser.json());
  app.use(require("method-override")());
  app.use(cors());
  app.use(hateoas);
  app.use(express.static("./public"));

  app.disable("x-powered-by");

  load("model",{cwd : 'app'}).then("controller").then("route").into(app);

  return app;
}
