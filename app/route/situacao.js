module.exports = function (app) {
   var situacao = app.controller.situacao;

   app.post("/situacoes",situacao.salvar);
   app.get("/situacoes",situacao.listar);
   app.get("/situacoes/:id",situacao.listarSituacao);
   app.put("/situacoes/:id",situacao.editar);
   app.delete("/situacoes/:id",situacao.deletar);
}
