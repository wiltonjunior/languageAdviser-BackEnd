module.exports = function (app) {
    var arquivo = app.controller.arquivo;
    var fs = app.get("fs");

    app.get("/imagem",arquivo.diretorioImagem);
    app.get("/imagem/administrador",arquivo.diretorioAdministrador);
    app.get("/imagem/aluno",arquivo.diretorioAluno);
    app.get("/imagem/autor",arquivo.diretorioAutor);
    app.get("/imagem/idioma",arquivo.diretorioIdioma);
    app.get("/imagem/nivel",arquivo.diretorioNivel);
    app.get("/imagem/situacao",arquivo.diretorioSituacao);
}
