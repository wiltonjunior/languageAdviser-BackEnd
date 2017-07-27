module.exports = function (app) {
   var aluno = app.controller.aluno;

   app.post("/aluno",aluno.salvar);
   app.get("/aluno",aluno.listar);
   app.get("/aluno/:id",aluno.listarAluno);
   app.put("/aluno/:id",aluno.editar);
   app.delete("/aluno/:id",aluno.deletar);
}
