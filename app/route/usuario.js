module.exports = function (app) {
   var usuario = app.controller.usuario;

   app.post("/usuarios",usuario.salvar);
   app.post("/usuarios/login",usuario.login);
   app.get("/usuarios",usuario.listar);
   app.get("/usuarios/:id",usuario.listarUsuario);
   app.get("/usuarios/idioma/:id",usuario.listarIdioma);
   app.delete("/usuarios/:id",usuario.deletar);
}
