module.exports = function (app) {
   var dialogo = app.controller.dialogo;

   app.post("/dialogos",dialogo.salvar);
   app.post("/dialogos/estudar",dialogo.estudar);
   app.get("/dialogos",dialogo.listar);
   app.get("/dialogos/:id",dialogo.listarDialogo);
   app.get("/dialogos/licao/:idLicao",dialogo.listarLicao);
   app.put("/dialogos/:id",dialogo.editar);
   app.delete("/dialogos/:id",dialogo.deletar);
}
