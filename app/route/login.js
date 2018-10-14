module.exports = function (app) {
  var login = app.controller.login;

  var versao = app.get("version");

  app.post(versao + "/login",login.loginUsuario);

}
