module.exports = function (app) {
   var regiao = app.controller.regiao;
   var auth = app.get("auth");

   var versao = app.get("version");

   app.post(versao + "/regioes", auth.authenticate(), regiao.salvar);
   app.get(versao + "/regioes", auth.authenticate(), regiao.listar);
   app.get(versao + "/regioes/:id", auth.authenticate(), regiao.listarRegiao);
   app.put(versao + "/regioes/:id", auth.authenticate(), regiao.editar);
   app.delete(versao + "/regioes/:id", auth.authenticate(), regiao.deletar);
}
