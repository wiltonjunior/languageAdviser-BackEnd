module.exports = function (app) {
    var licao = app.controller.licao;

    app.post("/licoes",licao.salvar);
    app.get("/licoes",licao.listar);
    app.get("/licoes/:id",licao.listarLicao);
    app.get("/licoes/autor/:id",licao.listarAutor);
    app.get("/licoes/conteudo/:id",licao.listarConteudo);
    app.get("/licoes/estudar/:idLicao&:idUsuario",licao.estudarLicao);
    app.get("/licoes/avaliacao/:idLicao&:avaliacao",licao.editarVotos);
    app.put("/licoes/:id",licao.editar);
    app.delete("/licoes/:id",licao.deletar);
}
