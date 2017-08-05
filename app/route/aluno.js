module.exports = function (app) {
   var aluno = app.controller.aluno;

   app.post("/alunos",aluno.salvar);
   app.get("/alunos",aluno.listar);
   app.get("/alunos/:id",aluno.listarAluno);
   app.put("/alunos/:id",aluno.editar);
   app.delete("/alunos/:id",aluno.deletar);
}
