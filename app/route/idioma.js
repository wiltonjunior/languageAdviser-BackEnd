module.exports = function (app) {
   var idioma = app.controller.idioma;

   app.post("/idioma", idioma.salvar);
   app.post("/idioma/teste", idioma.teste);
   app.get("/idioma", idioma.listar);
   app.get("/idioma/:id", idioma.listarIdioma);
   app.put("/idioma/:id", idioma.editar);
   app.delete("/idioma/:id", idioma.deletar);
}
