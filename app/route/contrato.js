module.exports = function (app) {
  var contrato = app.controller.contrato;

  app.post("/contrato", contrato.salvar);
  app.get("/contrato", contrato.listar);
  app.get("/contrato/:id", contrato.listarContrato);
  app.get("/contrato/empresa/:id", contrato.listarEmpresa);
  app.get("/contrato/termo/:id", contrato.listarTermo);
  app.get("/contrato/regiao/:id", contrato.listarRegiao);
  app.put("/contrato/:id", contrato.editar);
  app.delete("/contrato/:id", contrato.deletar);
}
