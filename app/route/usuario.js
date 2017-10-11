module.exports = function (app) {
   var usuario = app.controller.usuario;
   var auth = app.get("auth");

   var versao = "/v1";

   app.post(versao + "/usuarios", usuario.salvar);
   app.post(versao + "/usuarios/imagem/:id", usuario.imagem);
   app.get(versao + "/usuarios", auth.authenticate(), usuario.listar);
   app.get(versao + "/usuarios/avaliacao/:id", auth.authenticate(), usuario.avaliacao);
   app.get(versao + "/usuarios/ranking", auth.authenticate(), usuario.ranking);
   app.get(versao + "/usuarios/:id", auth.authenticate(), usuario.listarUsuario);
   app.put(versao + "/usuarios/:id", auth.authenticate(), usuario.editar);
   app.delete(versao + "/usuarios/:id", auth.authenticate(), usuario.deletar);

}
