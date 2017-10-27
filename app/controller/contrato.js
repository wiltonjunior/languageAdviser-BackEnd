module.exports = function (app) {
   var model = app.model.contrato;
   var Joi = app.get("joi");
   var db = app.get("database");
   var dbContrato = db.collection("contrato");

   var cache = app.get("cache");

   var contrato = {};

   var versao = "/v1";

   contrato.salvar = function (req,res) {
      var dados = req.body;
      var result = Joi.validate(dados,model);
      if (result.error!=null) {
        res.status(400).json(result.error);
      }
      else {
        dbContrato.save(dados)
        .then(val => {
           val._links = [
             {rel : "procurar", method : "GET", href: "http://" + req.headers.host + versao + "/contratos/" + val._key},
             {rel : "atualizar", method : "PUT", href: "http://" + req.headers.host + versao + "/contratos/" + val._key},
             {rel : "excluir", method : "DELETE", href: "http://" + req.headers.host + versao + "/contratos/" + val._key}
           ]
           res.status(201).json(val).end()
        }, err => {
           res.status(500).json(err).end()
        })
      }
   };


   contrato.listar = function (req,res) {
      var resultado = cache.get("listarContrato");
      if(resultado==undefined) {
        dbContrato.all()
        .then(cursor => {
           cursor.all()
           .then(val => {
             var links = {
               _links : [
                   {rel : "adicionar", method: "POST", href: "http://" + req.headers.host + versao + "/contratos/"},
                   {rel : "listar", method: "GET", href: "http://" + req.headers.host + versao + "/contratos/"}
               ]
             };
             val.push(links);
             cache.set("listarContrato",val,10);
             res.status(200).json(val).end()
           });
        });
      }
      else {
         res.status(200).json(resultado).end()
      }
   };

   contrato.ativo = function (req,res) {
      var resultado = cache.get("listarContratoAtivo");
      if(resultado==undefined) {
        var today = new Date();
        var data = dataAtual(today);
        db.query("LET ANO = (FOR contrato IN contrato RETURN {'idContrato' : contrato._key,'dataTermino' : contrato.dataTermino, 'data' : DATE_DIFF(@data,contrato.dataTermino,'y',false)}) LET MES = (FOR a IN ANO FILTER a.data >= 0 RETURN {'idContrato' : a.idContrato, 'dataTermino' : a.dataTermino, 'data' : DATE_DIFF(@data,a.dataTermino,'m',false)}) LET DIA = (FOR m IN MES FILTER m.data >= 0 RETURN {'idContrato' : m.idContrato, 'dataTermino' : m.dataTermino, 'data' : DATE_DIFF(@data,m.dataTermino,'d',false)}) LET cont = (FOR contrato IN contrato FOR d IN DIA FILTER d.data >= 0 and d.idContrato == contrato._key RETURN contrato) RETURN cont",{'data' : data})
        .then(cursor => {
           cursor.all()
           .then(val => {
               var links = {
                 _links : [
                   {rel : "adicionar", method: "POST", href: "http://" + req.headers.host + versao + "/contratos/"},
                   {rel : "listar", method: "GET", href: "http://" + req.headers.host + versao + "/contratos/"}
                 ]
               };
              val.push(links);
              cache.set("listarContratoAtivo",val,10);
              res.status(200).json(val).end()
           })
        })
      }
      else {
         res.status(200).json(resultado).end()
      }
   };

   contrato.expirado = function (req,res) {
      var resultado = cache.get("listarContratoExpirado");
      if(resultado==undefined) {
        var today = new Date();
        var data = dataAtual(today);
        db.query("LET ANO = (FOR contrato IN contrato RETURN {'idContrato' : contrato._key,'dataTermino' : contrato.dataTermino, 'data' : DATE_DIFF(@data,contrato.dataTermino,'y',false)}) LET MES = (FOR a IN ANO FILTER a.data <= 0 RETURN {'idContrato' : a.idContrato, 'dataTermino' : a.dataTermino, 'data' : DATE_DIFF(@data,a.dataTermino,'m',false)}) LET DIA = (FOR m IN MES FILTER m.data <= 0 RETURN {'idContrato' : m.idContrato, 'dataTermino' : m.dataTermino, 'data' : DATE_DIFF(@data,m.dataTermino,'d',false)}) LET cont = (FOR contrato IN contrato FOR d IN DIA FILTER d.data < 0 and d.idContrato == contrato._key RETURN contrato) RETURN cont",{'data' : data})
        .then(cursor => {
           cursor.next()
           .then(val => {
              var links = {
                _links : [
                  {rel: "adicionar", method: "POST", href: "http://" + req.headers.host + versao + "/contratos/"},
                  {rel: "listar", method: "GET", href: "http://" + req.headers.host + versao + "/contratos/"}
                ]
              };
              val.push(links);
              cache.set("listarContratoExpirado",val,10);
              res.status(200).json(val).end()
           })
        })
      }
      else {
         res.status(200).json(resultado).end()
      }
   }

   function dataAtual(today) {
      var dd = today.getDate();
      var month = today.getMonth() + 1;
      var year = today.getFullYear();
      var data = month + "-" + dd + "-" + year;
      return data;
   }

   contrato.listarContrato = function (req,res) {
      var id = req.params.id;
      var nomeCache = "listarContrato" + id;
      var resultado = cache.get(nomeCache);
      if(resultado==undefined) {
        dbContrato.document(id)
        .then(val => {
          val._links = [
            {rel : "adicionar", method: "POST", href: "http://" + req.headers.host + versao + "/contratos/"},
            {rel : "empresa", method: "GET", href: "http://" + req.headers.host + versao + "/contratos/empresa/" + id},
            {rel : "termos", method: "GET", href: "http://" + req.headers.host + versao + "/contratos/termos/" + id},
            {rel : "regiao", method: "GET", href: "http://" + req.headers.host + versao + "/contratos/regiao/" + id},
            {rel : "editar", method: "PUT", href: "http://" + req.headers.host + versao + "/contratos/" + id},
            {rel : "excluir", method: "DELETE", href: "http://" + req.headers.host + versao + "/contratos/" + id}
          ]
          cache.set(nomeCache,val,20);
          res.status(200).json(val).end()
        }, err => {
          res.status(500).json(err).end()
        });
      }
      else {
         res.status(200).json(resultado).end()
      }
   };

   contrato.listarEmpresa = function (req,res) {
      var id = req.params.id;
      var nomeCache = "listarContratoEmpresa" + id;
      var resultado = cache.get(nomeCache);
      if(resultado==undefined) {
        db.query("FOR empresa IN empresa FOR contrato IN contrato FILTER contrato._key == @id and contrato.idEmpresa == empresa._key RETURN empresa",{'id' : id})
        .then(cursor => {
           cursor.next()
           .then(val => {
             val.links = [
               {rel : "adicionar", method: "POST", href: "http://" + req.headers.host + versao + "/contratos/"},
               {rel : "listar", method: "GET", href: "http://" + req.headers.host + versao + "/contratos/"},
               {rel : "editar", method: "PUT", href: "http://" + req.headers.host + versao + "/contratos/" + id},
               {rel : "excluir", method: "DELETE", href: "http://" + req.headers.host + versao + "/contratos/" + id}
             ]
             cache.set(nomeCache,val,20);
             res.status(200).json(val).end();
           });
        });
      }
      else {
        res.status(200).json(resultado).end()
      }
   };

   contrato.listarTermos = function (req,res) {
      var id = req.params.id;
      var nomeCache = "listarContratoTermo" + id;
      var resultado = cache.get(nomeCache);
      if(resultado==undefined) {
        db.query("FOR termos IN termos FOR contrato IN contrato FILTER contrato._key == @id and contrato.idTermo == termos._key RETURN termos",{'id' : id})
        .then(cursor => {
           cursor.next()
           .then(val => {
             val.links = [
               {rel : "adicionar", method: "POST", href: "http://" + req.headers.host + versao + "/contratos/"},
               {rel : "listar", method: "GET", href: "http://" + req.headers.host + versao + "/contratos/"},
               {rel : "editar", method: "PUT", href: "http://" + req.headers.host + versao + "/contratos/" + id},
               {rel : "excluir", method: "DELETE", href: "http://" + req.headers.host + versao + "/contratos/" + id}
             ]
             cache.set(nomeCache,val,20);
             res.status(200).json(val).end();
           });
        });
      }
      else {
        res.status(200).json(resultado).end()
      }
   };

   contrato.listarRegiao = function (req,res) {
      var id = req.params.id;
      var nomeCache = "listarContratoRegiao" + id;
      var resultado = cache.get(nomeCache);
      if(resultado==undefined) {
        db.query("FOR regiao IN regiao FOR contrato IN contrato FILTER contrato._key == @id and contrato.idRegiao == regiao._key or regiao._key IN contrato.idRegiao RETURN regiao",{'id' : id})
        .then(cursor => {
           cursor.all()
           .then(val => {
             val._links = [
               {rel : "adicionar", method: "POST", href: "http://" + req.headers.host + versao + "/contratos"},
               {rel : "listar", method: "GET", href: "http://" + req.headers.host + versao + "/contratos"},
               {rel : "editar", method: "PUT", href: "http://" + req.headers.host + versao + "/contratos/" + id},
               {rel : "excluir", method: "DELETE", href: "http://" + req.headers.host + versao + "/contratos/" + id}
             ]
             cache.set(nomeCache,val,20);
             res.status(200).json(val).end();
           });
        });
      }
      else {
        res.status(200).json(resultado).end()
      }
   };

   contrato.listarEmpresas = function (req,res) {
      var idEmpresa = req.params.idEmpresa;
      var nomeCache = "listarContratoEmpresas" + idEmpresa;
      var resultado = cache.get(nomeCache);
      if(resultado==undefined) {
        db.query("FOR contrato IN contrato FILTER contrato.idEmpresa == @id RETURN contrato",{'id' : idEmpresa})
        .then(cursor => {
           cursor.all()
           .then(val => {
              var links = {
                _links : [
                    {rel : "adicionar", method: "POST", href: "http://" + req.headers.host + versao + "/contratos"},
                    {rel : "listar", method: "GET", href: "http://" + req.headers.host + versao + "/contratos"}
                ]
              };
              val.push(links);
              cache.set(nomeCache,val,20);
              res.status(200).json(val).end();
           })
        })
      }
      else {
        res.status(200).json(resultado).end()
      }
   };

   contrato.listarTermosContrato = function (req,res) {
      var idTermo = req.params.idTermo;
      var nomeCache = "listarContratoTermos" + idTermo;
      var resultado = cache.get(nomeCache);
      if (resultado==undefined) {
        db.query("FOR contrato IN contrato FILTER @id IN contrato.idTermo or contrato.idTermo == @id RETURN contrato",{'id' : idTermo})
        .then(cursor => {
          cursor.all()
          .then(val => {
            var links = {
              _links : [
                {rel : "adicionar", method: "POST", href: "http://" + req.headers.host + versao + "/contratos"},
                {rel : "listar", method: "GET", href: "http://" + req.headers.host + versao + "/contratos"}
              ]
            };
            val.push(links);
            cache.set(nomeCache,val,20);
            res.status(200).json(val).end();
          })
        })
      }
      else {
         res.status(200).json(resultado).end()
      }
   };

   contrato.listarRegioes = function (req,res) {
      var idRegiao = req.params.idRegiao;
      var nomeCache = "listarContratoRegioes" + idRegiao;
      var resultado = cache.get(nomeCache);
      if(resultado==undefined) {
        db.query("FOR contrato IN contrato FILTER contrato.idRegiao == @id RETURN contrato",{'id' : idRegiao})
        .then(cursor => {
           cursor.all()
           .then(val => {
              var links = {
                _links : [
                  {rel : "adicionar", method: "POST", href: "http://" + req.headers.host + versao + "/contratos"},
                  {rel : "listar", method: "GET", href: "http://" + req.headers.host + versao + "/contratos"}
                ]
              };
              val.push(links);
              cache.set(nomeCache,val,20);
              res.status(200).json(val).end();
           })
        })
      }
      else {
         res.status(200).json(resultado).end()
      }
   };

   contrato.editarTermo = async function (req,res) {
      var dados = req.body;
      var resultados =  await db.query("FOR contrato IN contrato FILTER contrato._key == @id RETURN contrato",{'id' : dados._key});
      var quantRegiao = await regiao(resultados._result[0].idRegiao);
      if(quantRegiao!=0){
         var quantContrato = await termos(resultados._result[0].idRegiao,dados.idTermo);
         if(quantContrato!=0) {
           var resposta = {'mensagem' : 'Contrato com termos parecidos já existe'};
           res.status(409).json(resposta);
         }
         else {
           var result = await adicionarTermo(resultados,dados.idTermo);
           result._links = [
             {rel : "adicionar", method: "POST", href: "http://" + req.headers.host + versao + "/contratos/"},
             {rel : "listar", method: "GET", href: "http://" + req.headers.host + versao + "/contratos/"},
             {rel : "procurar", method: "GET", href: "http://" + req.headers.host + versao + "/contratos/" + dados._key},
             {rel : "excluir", method: "DELETE", href: "http://" + req.headers.host + versao + "/contratos/" + dados._key}
           ]
           res.status(200).json(result).end()
         }
      }
      else {
        var result = await adicionarTermo(resultados,dados.idTermo);
        result._links = [
          {rel : "adicionar", method: "POST", href: "http://" + req.headers.host + versao + "/contratos/"},
          {rel : "listar", method: "GET", href: "http://" + req.headers.host + versao + "/contratos/"},
          {rel : "procurar", method: "GET", href: "http://" + req.headers.host + versao + "/contratos/" + dados._key},
          {rel : "excluir", method: "DELETE", href: "http://" + req.headers.host + versao + "/contratos/" + dados._key}
        ]
        res.status(200).json(result).end()
      }
   };

   async function regiao(idRegiao) {
      var resultados = await db.query("LET cont = (FOR contrato IN contrato FILTER contrato.idRegiao == @id RETURN contrato) RETURN length(cont)",{'id' : idRegiao});
      return resultados._result[0];
   };


   async function termos(idRegiao,idTermo) {
      var resultados = await db.query("LET cont = (FOR contrato IN contrato FILTER contrato.idRegiao == @id RETURN contrato) LET contrato = (FOR c IN cont FILTER c.idTermo ANY IN @termos or c.idTermo ANY == @termos or c.idTermo == @termos or c.idTermo IN @termos RETURN c) RETURN length(contrato)",{'id' : idRegiao,'termos' : idTermo});
      return resultados._result[0];
   };

   async function adicionarTermo(resultados,idTermo) {
     var termo = [];
     var termos = resultados._result[0].idTermo;
     if(resultados._result[0].idTermo == undefined){
        termo = idTermo;
     }
     else {
       var valor = Array.isArray(termos);
       if(valor==true) {
         termo = resultados._result[0].idTermo;
         termo.push(idTermo);
       }
       else {
         termo.push(termos);
         termo.push(idTermo);
       }
     }
     var result = await dbContrato.update(resultados._result[0]._key,{'idTermo' : termo});
     return result;
   };


   contrato.deletarTermo = async function (req,res) {
      var dados = req.body;
      var resultados = await db.query("FOR contrato IN contrato FILTER contrato._key == @id RETURN contrato",{'id' : dados._key});
      var termos = resultados._result[0].idTermo;
      var valor = Array.isArray(termos);
      if(valor==true) {
         var pos = termos.indexOf(dados.idTermo);
         if(pos>=0) {
            termos.splice(pos,1);
            if(termos.length==1) {
              dados.idTermo = termos[0];
            }
            else {
              dados.idTermo = termos;
            }
         }
         else {
            var resposta = {"mensagem" : "Termo não tem neste contrato"};
            res.status(404).json(resposta);
         }
      }
      else {
         if(dados.idTermo==termos) {
            dados.idTermo = null;
         }
         else {
            var resposta = {"mensagem" : "Termo não tem neste contrato"};
            res.status(404).json(resposta);
         }
      }
      dbContrato.update(dados._key,{"idTermo" : dados.idTermo})
      .then(val => {
        val._links = [
          {rel : "adicionar", method: "POST", href: "http://" + req.headers.host + versao + "/contratos"},
          {rel : "listar", method: "GET", href: "http://" + req.headers.host + versao + "/contratos/"},
          {rel : "procurar", method: "GET", href: "http://" + req.headers.host + versao + "/contratos" + dados._key},
          {rel : "excluir", method: "DELETE", href: "http://" + req.headers.host + versao + "/contratos/" + dados._key}
        ]
        res.status(200).json(val).end()
      }, err => {
        res.status(500).json(err).end()
      })
   };

   contrato.editar = function (req,res) {
      var id = req.params.id;
      var dados = req.body;
      var result = Joi.validate(dados,model);
      if (result.error!=null) {
         res.status(400).json(result.error);
      } else {
         dbContrato.update(id,dados)
         .then(val => {
           val._links = [
             {rel : "adicionar", method: "POST", href: "http://" + req.headers.host + versao + "/contratos"},
             {rel : "listar", method: "GET", href: "http://" + req.headers.host + versao + "/contratos"},
             {rel : "procurar", method: "GET", href: "http://" + req.headers.host + versao + "/contratos/" + dados._key},
             {rel : "excluir", method: "DELETE", href: "http://" + req.headers.host + versao + "/contratos/" + dados._key}
           ]
           res.status(200).json(val).end()
         }, err => {
            res.status(500).json(err).end()
         });
      }
   };

   contrato.deletar = function (req,res) {
      var id = req.params.id;
      dbContrato.remove(id)
      .then(val => {
        val._links = [
          {rel : "adicionar", method: "POST", href: "http://" + req.headers.host + versao + "/contratos"},
          {rel : "listar", method: "GET", href: "http://" + req.headers.host + versao + "/contratos"}
        ]
        res.status(200).json(val).end()
      }, err => {
         res.status(500).json(err).end()
      });
   };


   return contrato;
}
