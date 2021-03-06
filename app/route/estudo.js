module.exports = function (app) {
   var estudo = app.controller.estudo;
   var auth = app.get("auth");

   var versao = app.get("version");

   app.post(versao + "/estudos", auth.authenticate(), estudo.salvar);
   app.get(versao + "/estudos", auth.authenticate(), estudo.listar);
   app.get(versao + "/estudos/:id", auth.authenticate(), estudo.listarUsuario);
   app.put(versao + "/estudos", auth.authenticate(), estudo.editar);
   app.delete(versao + "/estudos/:id", auth.authenticate(), estudo.deletar);
}
