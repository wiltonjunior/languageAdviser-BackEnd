module.exports = function (app) {
   var nivel = app.controller.nivel;

   app.post("/niveis",nivel.salvar);
   app.post("/niveis/imagem/:id",nivel.imagem);
   app.get("/niveis",nivel.listar);
   app.get("/niveis/:id",nivel.listarNivel);
   app.put("/niveis/:id",nivel.editar);
   app.delete("/niveis/:id",nivel.deletar);
}
