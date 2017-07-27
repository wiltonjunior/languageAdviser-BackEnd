module.exports = function (app) {
   var autor = app.controller.autor;

   app.post("/autor",autor.salvar);
   app.get("/autor",autor.listar);
   app.get("/autor/:id",autor.listarAutor);
   app.get("/autor/idioma/:id",autor.listarIdioma);
   app.put("/autor/:id",autor.editar);
   app.delete("/autor/:id",autor.deletar);
}
