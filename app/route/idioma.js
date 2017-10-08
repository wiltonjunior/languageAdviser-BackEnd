module.exports = function (app) {
   var idioma = app.controller.idioma;
   var auth = app.get("auth");

   var versao = "/v1";

   app.post(versao + "/idiomas", auth.authenticate(), idioma.salvar);
   app.post(versao + "/idiomas/imagem/:id", auth.authenticate(), idioma.imagem);
   app.get(versao + "/idiomas", auth.authenticate(), idioma.listar);
   app.get(versao + "/idiomas/:id", auth.authenticate(), idioma.listarIdioma);
   app.put(versao + "/idiomas", auth.authenticate(), idioma.editar);
   app.delete(versao + "/idiomas", auth.authenticate(), idioma.deletar);
}
