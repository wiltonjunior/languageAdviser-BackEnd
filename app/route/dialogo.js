module.exports = function (app) {
   var dialogo = app.controller.dialogo;
   var auth = app.get("auth");

   var versao = "/v1";

   app.post(versao + "/dialogos", auth.authenticate(), dialogo.salvar);
   app.post(versao + "/dialogos/estudar", auth.authenticate(), dialogo.estudar);
   app.get(versao + "/dialogos", auth.authenticate(), dialogo.listar);
   app.get(versao + "/dialogos/:id", auth.authenticate(), dialogo.listarDialogo);
   app.get(versao + "/dialogos/licao/:id", auth.authenticate(), dialogo.listarLicao)
   app.get(versao + "/dialogos/licoes/:idLicao", auth.authenticate(), dialogo.listarLicoes);
   app.put(versao + "/dialogos/:id",auth.authenticate(), dialogo.editar);
   app.delete(versao + "/dialogos/:id",auth.authenticate(), dialogo.deletar);
}
