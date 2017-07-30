module.exports = function (app) {
    var licao = app.controller.licao;

    app.post("/licao",licao.salvar);
    app.get("/licao",licao.listar);
    app.get("/licao/:id",licao.listarLicao);
    app.get("/licao/autor/:id",licao.listarAutor);
    app.get("/licao/conteudo/:id",licao.listarConteudo);
    app.get("/licao/estudar/:idLicao&:idUsuario",licao.estudarLicao);
    app.put("/licao/:id",licao.editar);
    app.delete("/licao/:id",licao.deletar);
}
