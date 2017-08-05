module.exports = function (app) {
   var usuario = app.controller.usuario;

   app.post("/usuarios/:id",usuario.salvar);
   app.post("/usuarios/login",usuario.login);
   app.get("/usuarios",usuario.listar);
   app.get("/usuarios/:id",usuario.listarIdioma);
   app.delete("/usuarios/:id",usuario.deletar);
}
