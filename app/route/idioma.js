module.exports = function (app) {
   var idioma = app.controller.idioma;

   app.post("/idiomas", idioma.salvar);
   app.post("/idiomas/imagem/:id",idioma.imagem);
   app.get("/idiomas", idioma.listar);
   app.get("/idiomas/:id", idioma.listarIdioma);
   app.put("/idiomas/:id", idioma.editar);
   app.delete("/idiomas/:id", idioma.deletar);
}
