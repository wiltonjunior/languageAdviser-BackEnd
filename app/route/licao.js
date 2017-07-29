module.exports = function (app) {
    var licao = app.controller.licao;

    app.post("/licao",licao.salvar);
    app.get("/licao",licao.listar);
    app.get("/licao/:id",licao.listarLicao);
    app.get("/licao/estudar/:idLicao&:idUsuario",licao.estudarLicao);
    app.put("/licao/:id",licao.editar);
    app.delete("/licao/:id",licao.deletar);
}
