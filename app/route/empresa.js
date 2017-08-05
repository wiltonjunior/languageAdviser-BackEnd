module.exports = function (app) {
   var empresa = app.controller.empresa;

   app.post("/empresas", empresa.salvar);
   app.get("/empresas", empresa.listar);
   app.get("/empresas/:id", empresa.listarEmpresa);
   app.put("/empresas/:id", empresa.editar);
   app.delete("/empresas/:id", empresa.deletar);
}
