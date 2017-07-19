module.exports = function (app) {
   var empresa = app.controller.empresa;

   app.post("/empresa", empresa.salvar);
   app.get("/empresa", empresa.listar);
   app.get("/empresa/:id", empresa.listarContratante);
   app.put("/empresa/:id", empresa.editar);
   app.delete("/empresa/:id", empresa.deletar);
}
