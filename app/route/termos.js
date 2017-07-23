module.exports = function (app) {
   var termos = app.controller.termos;

   app.post("/termos", termos.salvar);
   app.get("/termos", termos.listar);
   app.get("/termos/:id", termos.listarTermo);
   app.put("/termos/:id", termos.editar);
   app.delete("/termos/:id", termos.deletar);
}
