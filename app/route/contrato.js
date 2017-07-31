module.exports = function (app) {
  var contrato = app.controller.contrato;

  app.post("/contrato", contrato.salvar);
  app.get("/contrato", contrato.listar);
  app.get("/contrato/ativo", contrato.ativo);
  app.get("/contrato/expirado", contrato.expirado);
  app.get("/contrato/:id", contrato.listarContrato);
  app.get("/contrato/empresa/:id", contrato.listarEmpresa);
  app.get("/contrato/regiao/:id", contrato.listarRegiao);
  app.get("/contrato/termos/:id", contrato.listarTermos);
  app.put("/contrato/:id", contrato.editar);
  app.delete("/contrato/:id", contrato.deletar);
}
