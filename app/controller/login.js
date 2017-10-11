module.exports = function (app) {
   var db = app.get("database");
   var jwt = app.get("jwt");

   var login = {};

   var versao = "/v1";

   login.loginUsuario = async function (req,res) {
      var dados = req.body;
      var usuario = await usuarioLogin(dados);
      if(usuario==null) {
         var administrador = await administradorLogin(dados);
         if(administrador==null) {
            var resposta = {"mensagem" : "Usuario não encontrado"};
            resposta._links = [
              {rel : "listar", method: "GET", href: "http://" + req.headers.host + versao + "/usuarios"},
              {rel : "listar", method: "GET", href: "http://" + req.headers.host + versao + "/estudos"}
            ]
            res.status(404).json(resposta).end()
         }
         else {
            var token = "JWT " + jwt.encode(administrador._key,"MyS3cr3tK3Y");
            administrador.token = token;
            administrador._links = [
              {rel : "listar", method: "GET", href: "http://" + req.headers.host + versao + "/usuarios"},
              {rel : "listar", method: "GET", href: "http://" + req.headers.host + versao + "/estudos"}
            ]
            res.status(200).json(administrador).end()
         }
      }
      else {
        var googleMaps = req.app.get("googleMaps");
        if(dados.latitude==0&&dados.longitude==0) {
           usuario._links = [
             {rel : "listar", method: "GET", href: "http://" + req.headers.host + versao + "/usuarios"},
             {rel : "listar", method: "GET", href: "http://" + req.headers.host + versao + "/estudos"}
           ]
           res.status(200).json(usuario).end()
        }
        else {
           googleMaps.reverseGeocode({
              latlng : {lat: dados.latitude, lng: dados.longitude}
           }, function (err,result) {
              if(err) {
                 res.status(500).json(err).end()
              }
              else {
                 var pais;
                 var estado;
                 var cidade;
                 var i;
                 for(i = 0; i < result.json.results[0].address_components.length; i++) {
                    if (result.json.results[0].address_components[i].types[0] == "administrative_area_level_2") {
                       cidade = result.json.results[0].address_components[i].long_name;
                    }
                    if (result.json.results[0].address_components[i].types[0] == "administrative_area_level_1") {
                       estado = result.json.results[0].address_components[i].long_name;
                    }
                    if (result.json.results[0].address_components[i].types[0] == "country") {
                       pais = result.json.results[0].address_components[i].long_name;
                    }
                 }
                 if(usuario.estudo!=null) {
                    usuario.usuario.pais = pais;
                    usuario.usuario.estado = estado;
                    usuario.usuario.cidade = cidade;
                 }
                 else {
                    usuario.pais = pais;
                    usuario.estado = estado;
                    usuario.cidade = cidade;
                 }
                 usuario._links = [
                   {rel : "listar", method: "GET", href: "http://" + req.headers.host + versao + "/usuarios"},
                   {rel : "listar", method: "GET", href: "http://" + req.headers.host + versao + "/estudos"},
                 ]
                 res.status(200).json(usuario).end()
              }
           })
        }
      }
   };

   async function usuarioLogin(dados) {
      var resultado = await db.query("FOR usuario IN usuario FOR estudo IN estudo FILTER usuario.emailUsuario == @email and usuario.senhaUsuario == @senha and usuario._key == estudo._key RETURN {usuario,estudo}",{'email' : dados.email,'senha' : dados.senha});
      if(resultado._result[0]==null) {
         resultado = await db.query("FOR usuario IN usuario FILTER usuario.emailUsuario == @email and usuario.senhaUsuario == @senha RETURN usuario",{'email' : dados.email,'senha' : dados.senha});
         if(resultado._result[0]!=null) {
           var token = "JWT " + jwt.encode(resultado._result[0]._key,"MyS3cr3tK3Y");
           resultado._result[0].token = token;
         }
         return resultado._result[0];
      }
      else {
         var usuario = resultado._result[0];
         var token = "JWT " + jwt.encode(usuario._key,"MyS3cr3tK3Y");
         usuario.usuario.token = token;
         var valor = Array.isArray(usuario.estudo.idIdioma);
         if(valor==true) {
            var idioma = [];
            var i;
            for(i=0;i<usuario.estudo.idIdioma.length;i++) {
               var rst = await db.query("FOR idioma IN idioma FILTER idioma._key == @id RETURN idioma",{'id' : usuario.estudo.idIdioma[i]});
               idioma.push(rst._result[0]);
            }
            usuario.estudo.idIdioma = idioma;
            return usuario;
         }
         else {
            var idioma;
            idioma = await db.query("FOR idioma IN idioma FILTER idioma._key == @id RETURN idioma",{'id' : usuario.estudo.idIdioma});
            usuario.estudo.idIdioma = idioma._result[0];
            return usuario;
         }
      }
   };

   async function administradorLogin(dados) {
      var resultado = await db.query("FOR administrador IN administrador FILTER administrador.emailAdministrador == @email and administrador.senhaAdministrador == @senha RETURN administrador",{'email' : dados.email,'senha' : dados.senha});
      return resultado._result[0];
   }


   return login;

}
