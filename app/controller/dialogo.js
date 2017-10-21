module.exports = function (app) {
   var model = app.model.dialogo;
   var Joi = app.get("joi");
   var db = app.get("database");
   var dbDialogo = db.collection("dialogo");

   var dialogo = {};

   var versao = "/v1";

   dialogo.salvar = async function (req,res) {
      var dados = req.body;
      var valor = Array.isArray(dados.personagem);
      if(valor==true) {
        var personagens = [];
        var i;
        for(i=0;i<dados.personagem.length;i++) {
          personagens.push(JSON.parse(dados.personagem[i]));
        }
        var persg = await adicionarPersonagem(personagens);
      }
      else {
        var personagem = JSON.parse(dados.personagem);
        var persg = await adicionarPersonagem(personagem);
      }
      dados.personagem = persg;
      var result = Joi.validate(dados,model);
      if (result.error!=null) {
         res.status(400).json(result.error)
      } else {
         dbDialogo.save(dados)
         .then(val => {
            val._links = [
              {rel : "procurar", method : "GET", href: "http://" + req.headers.host + versao + "/dialogos/" + val._key},
              {rel : "atualizar", method : "PUT", href: "http://" + req.headers.host + versao + "/dialogos/" + val._key},
              {rel : "excluir", method : "DELETE", href: "http://" + req.headers.host + versao + "/dialogos/" + val._key}
            ]
            res.status(200).json(val).end()
         }, err => {
            res.status(500).json(err).end()
         })
      }
   };

   async function adicionarPersonagem(personagem) {
      var valor = Array.isArray(personagem);
      if(valor==true) {
         var pergs = [];
         var i;
         for (i=0;i<personagem.length;i++) {
            pergs.push({"idPersonagem": i,"nomePersonagem": personagem[i].nomePersonagem,"tomVoz": personagem[i].tomVoz});
         }
         return pergs;
      }
      else {
         var perg = {"idPersonagem": 1,"nomePersonagem": personagem.nomePersonagem,"tomVoz": personagem.tomVoz};
         return perg;
      }
   };

   dialogo.listar = function (req,res) {
      dbDialogo.all()
      .then(cursor => {
         cursor.all()
         .then(val => {
            var links = {
              _links : [
                  {rel : "adicionar", method: "POST", href: "http://" + req.headers.host + versao + "/dialogos"},
                  {rel : "listar", method: "GET", href: "http://" + req.headers.host + versao + "/dialogos"}
              ]
            };
            val.push(links);
            res.status(200).json(val).end()
         })
      })
   };

   dialogo.listarDialogo = async function (req,res) {
      var id = req.params.id;
      dbDialogo.document(id)
      .then(async val => {
        var resultados = await db.query("FOR momento IN momento FILTER momento.idDialogo == @id SORT momento.ordem ASC RETURN momento",{'id' : id});
        var dialogo = [];
        var momento = resultados._result;
        var i;
        for(i=0;i<momento.length;i++) {
          var personagem = await procurarPersonagem(val.personagem,momento[i].idPersonagem);
          dialogo.push({"personagem":{"nomePersonagem": personagem.nomePersonagem,"tomVoz": personagem.tomVoz},"momento":{"textoNativo": momento[i].textoNativo,"textoTraduzido": momento[i].textoTraduzido}});
        }
        val.dialogo = dialogo;
        val._links = [
          {rel : "adicionar" ,method: "POST", href: "http://" + req.headers.host + versao + "/dialogos"},
          {rel : "listar" ,method: "GET", href: "http://" + req.headers.host + versao + "/dialogos"}
        ]
        res.status(200).json(val).end()
      }, err => {
        res.status(500).json(err).end()
      })
   };

   async function procurarPersonagem(personagem,idPersonagem) {
      var valor = Array.isArray(personagem);
      if (valor==true) {
         var i;
         for(i=0;i<personagem.length;i++) {
            if(personagem[i].idPersonagem==idPersonagem) {
               return personagem[i];
            }
         }
      }
      else {
         if(personagem.idPersonagem==idPersonagem) {
            return personagem;
         }
      }
   };

   dialogo.listarLicao = function (req,res) {
     var id = req.params.id;
     db.query("FOR licao IN licao FOR dialogo IN dialogo FILTER dialogo._key == @id and licao._key == dialogo.idLicao RETURN licao",{'id' : id})
     .then(cursor => {
        cursor.all()
        .then(val => {
          var links = {
            _links :  [
              {rel : "adicionar" ,method: "POST", href: "http://" + req.headers.host + versao + "/dialogos"},
              {rel : "listar" ,method: "GET", href: "http://" + req.headers.host + versao + "/dialogos"}
            ]
          };
          val.push(links);
          res.status(200).json(val).end();
        })
     })
   };

   dialogo.listarLicoes = function (req,res) {
     var idLicao = req.params.idLicao;
     db.query("FOR dialogo IN dialogo FILTER dialogo.idLicao == @id RETURN dialogo",{'id' : idLicao})
     .then(cursor => {
        cursor.all()
        .then(val => {
           var links = {
             _links : [
               {rel : "adicionar" ,method: "POST", href: "http://" + req.headers.host + versao + "/dialogos"},
               {rel : "listar" ,method: "GET", href: "http://" + req.headers.host + versao + "/dialogos"}
             ]
           };
           val.push(links);
           res.status(200).json(val).end()
        })
     })
   };

   dialogo.estudar = async function (req,res) {
      var dados = req.body;
      db.query("FOR dialogo IN dialogo FILTER dialogo._key == @id RETURN dialogo",{'id' : dados._key})
      .then(cursor => {
         cursor.next()
         .then(async val => {
            var dialogo = val;
            var resultados = await db.query("FOR momento IN momento FILTER momento.idDialogo == @id SORT momento.ordem ASC RETURN momento",{'id' : dialogo._key});
            var dialogos = [];
            var momento = resultados._result;
            var i;
            for(i=0;i<momento.length;i++) {
               var personagem = await procurarPersonagem(dialogo.personagem,momento[i].idPersonagem);
               dialogos.push({"personagem":{"nomePersonagem": personagem.nomePersonagem,"tomVoz": personagem.tomVoz},"momento":{"textoNativo": momento[i].textoNativo,"textoTraduzido": momento[i].textoTraduzido}});
            }
            dialogo.dialogo = dialogos;
            var contrato = await contratoAtivo(db);
            db.query("LET reg = (FOR regiao IN regiao FILTER regiao.localizacao == @pais or regiao.localizacao == @estado or regiao.localizacao == @cidade RETURN regiao._key) LET cont = (FOR c IN @contrato FOR r IN reg FILTER c.idRegiao == r RETURN c) LET term = (FOR termo IN termos FOR c IN cont FILTER termo._key == c.idTermo or termo._key IN c.idTermo RETURN {'_key' : termo._key,'termo' : termo.termo,'palavraChave' : c.palavraChave}) RETURN term",{'pais' : dados.pais,'estado' : dados.estado,'cidade' : dados.cidade,'contrato' : contrato})
            .then(cursor => {
               cursor.next()
               .then(val => {
                  if (val!=null) {
                    for(var i = 0; i < val.length; i++) {
                       var palavra = val[i].termo;
                       var j;
                       for(j=0;j<dialogo.dialogo.length;j++) {
                         var resultado = dialogo.dialogo[j].momento.textoNativo.search(palavra);
                         if(resultado>0) {
                           var re = new RegExp(palavra,"g");
                           var textoFinal = dialogo.dialogo[j].momento.textoNativo.replace(re,palavra + " " + val[i].palavraChave);
                           dialogo.dialogo[j].momento.textoNativo = textoFinal;
                         }
                       }
                    }
                  }
                  res.status(200).json(dialogo).end()
               })
            })
         })
      })
   };

   async function contratoAtivo(db) {
     var today = new Date();
     var data = dataAtual(today);
     var resultado = await db.query("LET ANO = (FOR contrato IN contrato RETURN {'idContrato' : contrato._key,'dataTermino' : contrato.dataTermino, 'data' : DATE_DIFF(@data,contrato.dataTermino,'y',false)}) LET MES = (FOR a IN ANO FILTER a.data >= 0 RETURN {'idContrato' : a.idContrato, 'dataTermino' : a.dataTermino, 'data' : DATE_DIFF(@data,a.dataTermino,'m',false)}) LET DIA = (FOR m IN MES FILTER m.data >= 0 RETURN {'idContrato' : m.idContrato, 'dataTermino' : m.dataTermino, 'data' : DATE_DIFF(@data,m.dataTermino,'d',false)}) LET cont = (FOR contrato IN contrato FOR d IN DIA FILTER d.data >= 0 and d.idContrato == contrato._key RETURN contrato) RETURN cont",{'data' : data});
     return resultado._result[0];
   };

   function dataAtual(today) {
     var dd = today.getDate();
     var month = today.getMonth() + 1;
     var year = today.getFullYear();
     var data = month + "-" + dd + "-" + year;
     return data;
   };

   dialogo.editar = function (req,res) {
      var id = req.params.id;
      var dados = req.body;
      var result = Joi.validate(dados,model);
      if (result.error) {
        res.status(400).json(result.error);
      } else {
        dbDialogo.update(id,dados)
        .then(val => {
           val._links = [
             {rel : "adicionar", method: "POST", href: "http://" + req.headers.host + versao + "/dialogos"},
             {rel : "listar", method: "GET", href: "http://" + req.headers.host + versao + "/dialogos"},
             {rel : "procurar", method: "GET", href: "http://" + req.headers.host + versao + "/dialogos/" + dados._key},
             {rel : "excluir", method: "DELETE", href: "http://" + req.headers.host + versao + "/dialogos/" + dados._key}
           ]
           res.status(200).json(val).end()
        }, err => {
           res.status(500).json(err).end()
        })
      }
   };

   dialogo.deletar = async function (req,res) {
     var id = req.params.id;
     dbDialogo.remove(id)
     .then(async val => {
        var resultados = await db.query("FOR momento IN momento FILTER momento.idDialogo == @id REMOVE momento IN momento",{'id' : id});
        val._links = [
          {rel : "adicionar", method: "POST", href: "http://" + req.headers.host + versao + "/dialogos"},
          {rel : "listar", method: "GET", href: "http://" + req.headers.host + versao + "/dialogos"}
        ]
        res.status(200).json(val).end()
     }, err => {
        res.status(500).json(err).end()
     })
   }

   return dialogo;
}
