module.exports = function (app) {
    var licao = app.controller.licao;
    var auth = app.get("auth");

    var versao = "/v1";

    app.post(versao + "/licoes", auth.authenticate(), licao.salvar);
    app.get(versao + "/licoes", auth.authenticate(), licao.listar);
    app.get(versao + "/licoes/:id", auth.authenticate(), licao.listarLicao);
    app.get(versao + "/licoes/usuario/:id", auth.authenticate(), licao.listarUsuario);
    app.get(versao + "/licoes/idioma/:id", auth.authenticate(), licao.listarIdioma);
    app.get(versao + "/licoes/nivel/:id", auth.authenticate(), licao.listarNivel);
    app.get(versao + "/licoes/situacao/:id", auth.authenticate(), licao.listarSituacao);
    app.get(versao + "/licoes/usuario/:idUsuario", auth.authenticate(), licao.usuarios);
    app.get(versao + "/licoes/idiomas/:idIdioma", auth.authenticate(), licao.idiomas);
    app.get(versao + "/licoes/niveis/:idNivel", auth.authenticate(), licao.niveis);
    app.get(versao + "/licoes/situacoes/:idSituacao", auth.authenticate(), licao.situacoes);
    app.get(versao + "/licoes/listar/:idIdioma/:idNivel/:idSituacao", auth.authenticate(), licao.selecionar);
    app.get(versao + "/licoes/estudar/:idLicao&:idUsuario", auth.authenticate(), licao.estudarLicao);
    app.put(versao + "/licoes/avaliacao", auth.authenticate(), licao.editarVotos);
    app.put(versao + "/licoes/:id", auth.authenticate(), licao.editar);
    app.delete(versao + "/licoes/:id", auth.authenticate(), licao.deletar);
}
