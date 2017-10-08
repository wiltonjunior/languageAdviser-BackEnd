module.exports = function (app) {
   var situacao = app.controller.situacao;
   var auth = app.get("auth");

   var versao = "/v1";

   app.post(versao + "/situacoes", auth.authenticate(), situacao.salvar);
   app.post(versao + "/situacoes/imagem/:id", auth.authenticate(), situacao.imagem);
   app.get(versao + "/situacoes", auth.authenticate(), situacao.listar);
   app.get(versao + "/situacoes/:id", auth.authenticate(), situacao.listarSituacao);
   app.put(versao + "/situacoes", auth.authenticate(), situacao.editar);
   app.delete(versao + "/situacoes", auth.authenticate(), situacao.deletar);
}
