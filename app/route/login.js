module.exports = function (app) {
  var login = app.controller.login;

  var versao = "/v1";

  app.post(versao + "/login",login.loginUsuario);

}
