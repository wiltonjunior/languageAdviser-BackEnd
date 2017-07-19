module.exports = function () {
  var arangojs = require("arangojs");

  var username = 'root';
  var password = 'arango2016';
  var host = 'lordi.uern.br';
  var port = '8529';
  var database = 'language-adviser';

  var db = new arangojs({
    url: `http://${username}:${password}@${host}:${port}`,
    databaseName: database
  });

  return db;
};
