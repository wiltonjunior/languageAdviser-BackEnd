module.exports = function (app) {
   var termos = app.controller.termos;
   var auth = app.get("auth");

   var versao = app.get("version");

   app.post(versao + "/termos", auth.authenticate(), termos.salvar);
   app.get(versao + "/termos", auth.authenticate(), termos.listar);
   app.get(versao + "/termos/:id", auth.authenticate(), termos.listarTermo);
   app.put(versao + "/termos/:id", auth.authenticate(), termos.editar);
   app.delete(versao + "/termos/:id", auth.authenticate(), termos.deletar);
}
