module.exports = function (app) {
   var nivel = app.controller.nivel;
   var auth = app.get("auth");

   var versao = "/v1";

   app.post(versao + "/niveis", auth.authenticate(), nivel.salvar);
   app.post(versao + "/niveis/imagem/:id", nivel.imagem);
   app.get(versao + "/niveis", auth.authenticate(), nivel.listar);
   app.get(versao + "/niveis/:id", auth.authenticate(), nivel.listarNivel);
   app.put(versao + "/niveis/:id", auth.authenticate(), nivel.editar);
   app.delete(versao + "/niveis/:id", auth.authenticate(), nivel.deletar);
}
