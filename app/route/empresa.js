module.exports = function (app) {
   var empresa = app.controller.empresa;
   var auth = app.get("auth");

   var versao = app.get("version");

   app.post(versao + "/empresas", auth.authenticate(), empresa.salvar);
   app.get(versao + "/empresas", auth.authenticate(), empresa.listar);
   app.get(versao + "/empresas/:id", auth.authenticate(), empresa.listarEmpresa);
   app.put(versao + "/empresas/:id", auth.authenticate(), empresa.editar);
   app.delete(versao + "/empresas/:id", auth.authenticate(), empresa.deletar);
}
