module.exports = function (app) {
   var autor = app.controller.autor;

   app.post("/autores",autor.salvar);
   app.get("/autores",autor.listar);
   app.get("/autores/:id",autor.listarAutor);
   app.get("/autores/idioma/:id",autor.listarIdioma);
   app.put("/autores/:id",autor.editar);
   app.delete("/autores/:id",autor.deletar);
}
