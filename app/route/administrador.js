module.exports = function (app) {
   var administrador = app.controller.administrador;

   app.post("/administrador",administrador.salvar);
   app.get("/administrador",administrador.listar);
   app.get("/administrador/:id",administrador.listarAdministrador);
   app.put("/administrador/:id",administrador.editar);
   app.delete("/administrador/:id",administrador.deletar);
}
