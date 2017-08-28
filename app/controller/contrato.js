module.exports = function (app) {
   var model = app.model.contrato;
   var Joi = app.get("joi");
   var db = app.get("database");
   var dbContrato = db.collection("contrato");

   var contrato = {};

   contrato.salvar = function (req,res) {
      var dados = req.body;
      var result = Joi.validate(dados,model);
      if (result.error!=null) {
         res.status(400).json(result.error);
      } else {
         db.query("LET cont = (FOR contrato IN contrato FILTER contrato.idRegiao == @id RETURN contrato) RETURN length(cont)",{'id' : dados.idRegiao})
         .then(cursor => {
            cursor.next()
            .then(val => {
               if(val!=0) {
                  db.query("LET cont = (FOR contrato IN contrato FILTER contrato.idRegiao == @id RETURN contrato) LET contrato = (FOR c IN cont FILTER c.idTermo ANY IN @termos or c.idTermo ANY == @termos or c.idTermo == @termos or c.idTermo IN @termos RETURN c) RETURN length(contrato)",{'id' : dados.idRegiao,'termos' : dados.idTermo})
                  .then(cursor => {
                     cursor.next()
                     .then(val => {
                        if(val!=0) {
                           var resposta = {'mensagem' : 'Contrato com termos parecidos já existe'};
                           res.status(409).json(resposta);
                        }
                        else {
                           dbContrato.save(dados)
                           .then(val => {
                             val._links = [
                               {rel : "procurar", method : "GET", href: "http://" + req.headers.host + "/contratos/" + val._key},
                               {rel : "atualizar", method : "PUT", href: "http://" + req.headers.host + "/contratos/" + val._key},
                               {rel : "excluir", method : "DELETE", href: "http://" + req.headers.host + "/contratos/" + val._key}
                             ]
                             res.status(201).json(val).end()
                           }, err => {
                              res.status(500).json(err).end()
                           })
                        }
                     })
                  })
               }
               else {
                 dbContrato.save(dados)
                 .then(val => {
                   val._links = [
                     {rel : "procurar", method : "GET", href: "http://" + req.headers.host + "/contratos/" + val._key},
                     {rel : "atualizar", method : "PUT", href: "http://" + req.headers.host + "/contratos/" + val._key},
                     {rel : "excluir", method : "DELETE", href: "http://" + req.headers.host + "/contratos/" + val._key}
                   ]
                   res.status(201).json(val).end()
                 }, err => {
                   res.status(500).json(err).end()
                 })
               }
            })
         })
      }
   };

   contrato.listar = function (req,res) {
      dbContrato.all()
      .then(cursor => {
         cursor.all()
         .then(val => {
           var links = {
             _links : [
                 {rel : "adicionar", method: "POST", href: "http://" + req.headers.host + "/contratos"},
                 {rel : "listar", method: "GET", href: "http://" + req.headers.host + "/contratos"}
             ]
           };
           val.push(links);
           res.status(200).json(val).end()
         });
      });
   };

   contrato.ativo = function (req,res) {
       var today = new Date();
       var data = dataAtual(today);
       db.query("LET ANO = (FOR contrato IN contrato RETURN {'idContrato' : contrato._key,'dataTermino' : contrato.dataTermino, 'data' : DATE_DIFF(@data,contrato.dataTermino,'y',false)}) LET MES = (FOR a IN ANO FILTER a.data >= 0 RETURN {'idContrato' : a.idContrato, 'dataTermino' : a.dataTermino, 'data' : DATE_DIFF(@data,a.dataTermino,'m',false)}) LET DIA = (FOR m IN MES FILTER m.data >= 0 RETURN {'idContrato' : m.idContrato, 'dataTermino' : m.dataTermino, 'data' : DATE_DIFF(@data,m.dataTermino,'d',false)}) LET cont = (FOR contrato IN contrato FOR d IN DIA FILTER d.data >= 0 and d.idContrato == contrato._key RETURN contrato) RETURN cont",{'data' : data})
       .then(cursor => {
          cursor.next()
          .then(val => {
              val._links = [
                {rel : "adicionar", method: "POST", href: "http://" + req.headers.host + "/contratos"},
                {rel : "listar", method: "GET", href: "http://" + req.headers.host + "/contratos"}
              ]
             res.status(200).json(val).end()
          })
       })
   };

   contrato.expirado = function (req,res) {
      var today = new Date();
      var data = dataAtual(today);
      db.query("LET ANO = (FOR contrato IN contrato RETURN {'idContrato' : contrato._key,'dataTermino' : contrato.dataTermino, 'data' : DATE_DIFF(@data,contrato.dataTermino,'y',false)}) LET MES = (FOR a IN ANO FILTER a.data <= 0 RETURN {'idContrato' : a.idContrato, 'dataTermino' : a.dataTermino, 'data' : DATE_DIFF(@data,a.dataTermino,'m',false)}) LET DIA = (FOR m IN MES FILTER m.data <= 0 RETURN {'idContrato' : m.idContrato, 'dataTermino' : m.dataTermino, 'data' : DATE_DIFF(@data,m.dataTermino,'d',false)}) LET cont = (FOR contrato IN contrato FOR d IN DIA FILTER d.data < 0 and d.idContrato == contrato._key RETURN contrato) RETURN cont",{'data' : data})
      .then(cursor => {
         cursor.next()
         .then(val => {
            val._links = [
              {rel: "adicionar", method: "POST", href: "http://" + req.headers.host + "/contratos"},
              {rel: "listar", method: "GET", href: "http://" + req.headers.host + "/contratos"}
            ]
            res.status(200).json(val).end()
         })
      })
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
      dbContrato.document(id)
      .then(val => {
        val._links = [
          {rel : "adicionar", method: "POST", href: "http://" + req.headers.host + "/contratos"},
          {rel : "empresa", method: "GET", href: "http://" + req.headers.host + "/contratos/empresa/" + val._key},
          {rel : "termos", method: "GET", href: "http://" + req.headers.host + "/contratos/termos/" + val._key},
          {rel : "regiao", method: "GET", href: "http://" + req.headers.host + "/contratos/regiao/" + val._key},
          {rel : "editar", method: "PUT", href: "http://" + req.headers.host + "/contratos/" + val._key},
          {rel : "excluir", method: "DELETE", href: "http://" + req.headers.host + "/contratos/" + val._key}
        ]
        res.status(200).json(val).end()
      }, err => {
        res.status(500).json(err).end()
      });
   };

   contrato.listarEmpresa = function (req,res) {
      var id = req.params.id;
      db.query("FOR empresa IN empresa FOR contrato IN contrato FILTER contrato._key == @id and contrato.idEmpresa == empresa._key RETURN empresa",{'id' : id})
      .then(cursor => {
         cursor.next()
         .then(val => {
           val.links = [
             {rel : "adicionar", method: "POST", href: "http://" + req.headers.host + "/contratos"},
             {rel : "listar", method: "GET", href: "http://" + req.headers.host + "/contratos"},
             {rel : "editar", method: "PUT", href: "http://" + req.headers.host + "/contratos/" + id},
             {rel : "excluir", method: "DELETE", href: "http://" + req.headers.host + "/contratos/" + id}
           ]
           res.status(200).json(val).end();
         });
      });
   };

   contrato.listarTermos = function (req,res) {
      var id = req.params.id;
      db.query("FOR termos IN termos FOR contrato IN contrato FILTER contrato._key == @id and contrato.idTermo == termos._key RETURN termos",{'id' : id})
      .then(cursor => {
         cursor.next()
         .then(val => {
           val.links = [
             {rel : "adicionar", method: "POST", href: "http://" + req.headers.host + "/contratos"},
             {rel : "listar", method: "GET", href: "http://" + req.headers.host + "/contratos"},
             {rel : "editar", method: "PUT", href: "http://" + req.headers.host + "/contratos/" + id},
             {rel : "excluir", method: "DELETE", href: "http://" + req.headers.host + "/contratos/" + id}
           ]
           res.status(200).json(val).end();
         });
      });
   };

   contrato.listarRegiao = function (req,res) {
      var id = req.params.id;
      db.query("FOR regiao IN regiao FOR contrato IN contrato FILTER contrato._key == @id and contrato.idRegiao == regiao._key or regiao._key IN contrato.idRegiao RETURN regiao",{'id' : id})
      .then(cursor => {
         cursor.all()
         .then(val => {
           val._links = [
             {rel : "adicionar", method: "POST", href: "http://" + req.headers.host + "/contratos"},
             {rel : "listar", method: "GET", href: "http://" + req.headers.host + "/contratos"},
             {rel : "editar", method: "PUT", href: "http://" + req.headers.host + "/contratos/" + id},
             {rel : "excluir", method: "DELETE", href: "http://" + req.headers.host + "/contratos/" + id}
           ]
           res.status(200).json(val).end();
         });
      });
   };

   contrato.listarEmpresas = function (req,res) {
      var idEmpresa = req.params.idEmpresa;
      db.query("FOR contrato IN contrato FILTER contrato.idEmpresa == @id RETURN contrato",{'id' : idEmpresa})
      .then(cursor => {
         cursor.all()
         .then(val => {
            var links = {
              _links : [
                  {rel : "adicionar", method: "POST", href: "http://" + req.headers.host + "/contratos"},
                  {rel : "listar", method: "GET", href: "http://" + req.headers.host + "/contratos"}
              ]
            };
            val.push(links);
            res.status(200).json(val).end();
         })
      })
   };

   contrato.listarTermosContrato = function (req,res) {
      var idTermo = req.params.idTermo;
      db.query("FOR contrato IN contrato FILTER @id IN contrato.idTermo or contrato.idTermo == @id RETURN contrato",{'id' : idTermo})
      .then(cursor => {
        cursor.all()
        .then(val => {
          var links = {
            _links : [
              {rel : "adicionar", method: "POST", href: "http://" + req.headers.host + "/contratos"},
              {rel : "listar", method: "GET", href: "http://" + req.headers.host + "/contratos"}
            ]
          };
          val.push(links);
          res.status(200).json(val).end();
        })
      })
   };

   contrato.listarRegioes = function (req,res) {
      var idRegiao = req.params.idRegiao;
      db.query("FOR contrato IN contrato FILTER contrato.idRegiao == @id RETURN contrato",{'id' : idRegiao})
      .then(cursor => {
         cursor.all()
         .then(val => {
            var links = {
              _links : [
                {rel : "adicionar", method: "POST", href: "http://" + req.headers.host + "/contratos"},
                {rel : "listar", method: "GET", href: "http://" + req.headers.host + "/contratos"}
              ]
            };
            val.push(links);
            res.status(200).json(val).end();
         })
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
             {rel : "adicionar", method: "POST", href: "http://" + req.headers.host + "/contratos"},
             {rel : "listar", method: "GET", href: "http://" + req.headers.host + "/contratos"},
             {rel : "procurar", method: "GET", href: "http://" + req.headers.host + "/contratos/" + id},
             {rel : "excluir", method: "DELETE", href: "http://" + req.headers.host + "/contratos" + id}
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
          {rel : "adicionar", method: "POST", href: "http://" + req.headers.host + "/contratos"},
          {rel : "listar", method: "GET", href: "http://" + req.headers.host + "/contratos"}
        ]
        res.status(200).json(val).end()
      }, err => {
         res.status(500).json(err).end()
      });
   };


   return contrato;
}
