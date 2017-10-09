module.exports = function (app) {
  var contrato = app.controller.contrato;
  var auth = app.get("auth");

  var versao = "/v1";

  app.post(versao + "/contratos", auth.authenticate(), contrato.salvar);
  app.get(versao + "/contratos", auth.authenticate(), contrato.listar);
  app.get(versao + "/contratos/ativo", auth.authenticate(), contrato.ativo);
  app.get(versao + "/contratos/expirado", auth.authenticate(), contrato.expirado);
  app.get(versao + "/contratos/:id", auth.authenticate(), contrato.listarContrato);
  app.get(versao + "/contratos/empresa/:id", auth.authenticate(), contrato.listarEmpresa);
  app.get(versao + "/contratos/regiao/:id", auth.authenticate(), contrato.listarRegiao);
  app.get(versao + "/contratos/termos/:id", auth.authenticate(), contrato.listarTermos);
  app.get(versao + "/contratos/empresas/:idEmpresa", auth.authenticate(), contrato.listarEmpresas);
  app.get(versao + "/contratos/termosContrato/:idTermos", auth.authenticate(), contrato.listarTermosContrato);
  app.get(versao + "/contratos/regioes/:idRegiao", auth.authenticate(), contrato.listarRegioes);
  app.put(versao + "/contratos/adicionarTermo", auth.authenticate(), contrato.editarTermo);
  app.put(versao + "/contratos/deletarTermo", auth.authenticate(), contrato.deletarTermo);
  app.put(versao + "/contratos/:id", auth.authenticate(), contrato.editar);
  app.delete(versao + "/contratos/:id", auth.authenticate(), contrato.deletar);
}
