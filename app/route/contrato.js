module.exports = function (app) {
  var contrato = app.controller.contrato;

  app.post("/contratos", contrato.salvar);
  app.get("/contratos", contrato.listar);
  app.get("/contratos/ativo", contrato.ativo);
  app.get("/contratos/expirado", contrato.expirado);
  app.get("/contratos/:id", contrato.listarContrato);
  app.get("/contratos/empresa/:id", contrato.listarEmpresa);
  app.get("/contratos/regiao/:id", contrato.listarRegiao);
  app.get("/contratos/termos/:id", contrato.listarTermos);
  app.put("/contratos/:id", contrato.editar);
  app.delete("/contratos/:id", contrato.deletar);
}
