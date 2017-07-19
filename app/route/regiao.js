module.exports = function (app) {
   var regiao = app.controller.regiao;

   app.post("/regiao", regiao.salvar);
   app.get("/regiao", regiao.listar);
   app.get("/regiao/:id", regiao.listarRegiao);
   app.put("/regiao/:id", regiao.editar);
   app.delete("/regiao/:id", regiao.deletar);
}
