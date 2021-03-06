module.exports = function (app) {
    var momento = app.controller.momento;
    var auth = app.get("auth");

    var versao = app.get("version");

    app.post(versao + "/momentos", auth.authenticate(), momento.salvar);
    app.put(versao + "/momentos/:id", auth.authenticate(), momento.editar);    
}
