module.exports = function (app) {
    var licao = app.controller.licao;

    app.post("/licoes",licao.salvar);
    app.get("/licoes",licao.listar);
    app.get("/licoes/:id",licao.listarLicao);
    app.get("/licoes/autor/:id",licao.listarAutor);
    app.get("/licoes/idioma/:id",licao.listarIdioma);
    app.get("/licoes/nivel/:id",licao.listarNivel);
    app.get("/licoes/situacao/:id",licao.listarSituacao);
    app.get("/licoes/autores/:idAutor",licao.autores);
    app.get("/licoes/idiomas/:idIdioma",licao.idiomas);
    app.get("/licoes/niveis/:idNivel",licao.niveis);
    app.get("/licoes/situacoes/:idSituacao",licao.situacoes);
    app.get("/licoes/listar/:idIdioma/:idNivel/:idSituacao",licao.selecionar);
    app.get("/licoes/estudar/:idLicao&:idUsuario",licao.estudarLicao);
    app.put("/licoes/avaliacao/:idLicao/:avaliacao",licao.editarVotos);
    app.put("/licoes/:id",licao.editar);
    app.delete("/licoes/:id",licao.deletar);
}
