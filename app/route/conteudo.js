module.exports = function (app) {
    var conteudo = app.controller.conteudo;

    app.post("/conteudo", conteudo.salvar);
    app.get("/conteudo", conteudo.listar);
    app.get("/conteudo/:id", conteudo.listarConteudo);
    app.get("/conteudo/idioma/:id", conteudo.listarIdioma);
    app.put("/conteudo/:id", conteudo.editar);
    app.delete("/conteudo/:id", conteudo.deletar);
}
