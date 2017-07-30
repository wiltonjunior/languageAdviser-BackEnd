module.exports = function (app) {
   var usuario = app.controller.usuario;

   app.post("/usuario",usuario.salvar);
   app.get("/usuario",usuario.listar);
   app.get("/usuario/:id",usuario.listarUsuario);
   app.get("/usuario/:id",usuario.listarUsuarioEspecifico);
   app.get("/usuario/:id",usuario.listarIdioma);
   app.put("/usuario/:id",usuario.editar);
   app.delete("/usuario/:id",usuario.deletar);
}
