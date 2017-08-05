module.exports = function (app) {
   var regiao = app.controller.regiao;

   app.post("/regioes", regiao.salvar);
   app.get("/regioes", regiao.listar);
   app.get("/regioes/:id", regiao.listarRegiao);
   app.put("/regioes/:id", regiao.editar);
   app.delete("/regioes/:id", regiao.deletar);
}
