module.exports = function (app) {
   var idioma = app.controller.idioma;

   app.post("/idiomas", idioma.salvar);
   app.get("/idiomas", idioma.listar);
   app.get("/idiomas/:id", idioma.listarIdioma);
   app.put("/idiomas/:id", idioma.editar);
   app.delete("/idiomas/:id", idioma.deletar);
}
