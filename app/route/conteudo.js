module.exports = function (app) {
    var conteudo = app.controller.conteudo;

    app.post("/conteudos", conteudo.salvar);
    app.get("/conteudos", conteudo.listar);
    app.get("/conteudos/:id", conteudo.listarConteudo);
    app.get("/conteudos/idioma/:id", conteudo.listarIdioma);
    app.put("/conteudos/:id", conteudo.editar);
    app.delete("/conteudos/:id", conteudo.deletar);
}
