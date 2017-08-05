module.exports = function (app) {
   var dialogo = app.controller.dialogo;

   app.post("/dialogos",dialogo.salvar);
   app.get("/dialogos",dialogo.listar);
   app.get("/dialogos/:id",dialogo.listarDialogo);
   app.get("/dialogos/licao/:id",dialogo.listarLicao);
   app.get("/dialogos/estudar/:idDialogo&:idUsuario",dialogo.estudar);
   app.put("/dialogos/:id",dialogo.editar);
   app.delete("/dialogos/:id",dialogo.deletar);
}
