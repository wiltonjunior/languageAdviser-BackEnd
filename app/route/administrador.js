module.exports = function (app) {
   var administrador = app.controller.administrador;
   var auth = app.get("auth");

   var versao = "/v1";

   app.post(versao + "/administradores", auth.authenticate(), administrador.salvar);
   app.post(versao + "/administradores/imagem/:id", administrador.imagem);
   app.get(versao + "/administradores",auth.authenticate(), administrador.listar);
   app.get(versao + "/administradores/:id",auth.authenticate(), administrador.listarAdministrador);
   app.put(versao + "/administradores/:id",auth.authenticate(), administrador.editar);
   app.delete(versao + "/administradores/:id",auth.authenticate(), administrador.deletar);
}
