module.exports = function (app) {
   var administrador = app.controller.administrador;

   app.post("/administradores",administrador.salvar);
   app.post("/administradores/login",administrador.login);
   app.get("/administradores",administrador.listar);
   app.get("/administradores/:id",administrador.listarAdministrador);
   app.put("/administradores/:id",administrador.editar);
   app.delete("/administradores/:id",administrador.deletar);
}
