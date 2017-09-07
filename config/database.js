module.exports = function () {
  var arangojs = require("arangojs");

  var username = 'la';
  var password = 'la';
  var host = 'lordi.uern.br';
  var port = '8529';
  var database = 'language-adviser';

  var db = new arangojs({
    url: `http://${username}:${password}@${host}:${port}`,
    databaseName: database
  });

  return db;
};
