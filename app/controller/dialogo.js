module.exports = function (app) {
   var model = app.model.dialogo;
   var Joi = app.get("joi");

   var dialogo = {};

   dialogo.salvar = function (req,res) {
      var dados = req.body;
      var result = Joi.validate(dados,model);
      if (result.error!=null) {
         res.status(400).json(result.error)
      } else {
         var db = req.app.get("database");
         var dialogo = db.collection("dialogo");
         dialogo.save(dados)
         .then(val => {
            val._links = [
              {rel : "procurar", method : "GET", href: "http://191.252.109.164/dialogos/" + val._key},
              {rel : "atualizar", method : "PUT", href: "http://191.252.109.164/dialogos/" + val._key},
              {rel : "excluir", method : "DELETE", href: "http://191.252.109.164/dialogos/" + val._key}
            ]
            res.status(200).json(val).end()
         }, err => {
            res.status(500).json(err).end()
         })
      }
   };

   dialogo.listar = function (req,res) {
      var db = req.app.get("database");
      var dialogo = db.collection("dialogo");
      dialogo.all()
      .then(cursor => {
         cursor.all()
         .then(val => {
            res.status(200).json(val).end()
         })
      })
   };

   dialogo.listarDialogo = function (req,res) {
      var id = req.params.id;
      var db = req.app.get("database");
      var dialogo = db.collection("dialogo");
      dialogo.document(id)
      .then(val => {
        val._links = [
          {rel : "adicionar" ,method: "POST", href: "http://191.252.109.164/dialogos"},
          {rel : "listar" ,method: "GET", href: "http://191.252.109.164/dialogos"}
        ]
        res.status(200).json(val).end()
      }, err => {
        res.status(500).json(err).end()
      })
   };

   dialogo.listarLicao = function (req,res) {
     var idLicao = req.params.idLicao;
     var db = req.app.get("database");
     db.query("FOR licao IN licao FOR dialogo IN dialogo FILTER licao._key == @id and dialogo.idLicao == licao._key RETURN dialogo",{'id' : idLicao})
     .then(cursor => {
        cursor.all()
        .then(val => {
           val._links = [
            {rel : "adicionar" ,method: "POST", href: "http://191.252.109.164/dialogos"},
            {rel : "listar" ,method: "GET", href: "http://191.252.109.164/dialogos"}
           ]
           res.status(200).json(val).end()
        })
     })
   };

   dialogo.estudar = async function (req,res) {
      var dados = req.body;
      var db = req.app.get("database");
      db.query("FOR dialogo IN dialogo FILTER dialogo._key == @id RETURN dialogo",{'id' : dados.idDialogo})
      .then(cursor => {
         cursor.next()
         .then(async val => {
            var dialogo = val;
            var contrato = await contratoAtivo(db);
            db.query("LET reg = (FOR regiao IN regiao FILTER regiao.localizacao == @pais or regiao.localizacao == @estado or regiao.localizacao == @cidade RETURN regiao._key) LET cont = (FOR c IN @contrato FOR r IN reg FILTER c.idRegiao == r RETURN c) LET term = (FOR termo IN termos FOR c IN cont FILTER termo._key == c.idTermo or termo._key IN c.idTermo RETURN {'_key' : termo._key,'termo' : termo.termo,'termoTraducao' : termo.termoTraducao,'palavraChave' : c.palavraChave}) RETURN term",{'pais' : dados.pais,'estado' : dados.estado,'cidade' : dados.cidade,'contrato' : contrato})
            .then(cursor => {
               cursor.next()
               .then(val => {
                  if (val!=null) {
                    for(var i = 0; i < val.length; i++) {
                       var palavra = val[i].termoTraducao;
                       var resultado = dialogo.texto.search(palavra);
                       if(resultado>0) {
                         var re = new RegExp(palavra,"g");
                         var textoFinal = dialogo.texto.replace(re,palavra + " " + val[i].palavraChave);
                         dialogo.texto = textoFinal;
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
        var db = req.app.get("database");
        var dialogo = db.collection("dialogo");
        dialogo.update(id,dados)
        .then(val => {
           val._links = [
             {rel : "adicionar", method: "POST", href: "http://191.252.109.164/dialogos"},
             {rel : "listar", method: "GET", href: "http://191.252.109.164/dialogos"},
             {rel : "procurar", method: "GET", href: "http://191.252.109.164/dialogos/" + id},
             {rel : "excluir", method: "DELETE", href: "http://191.252.109.164/dialogos/" + id}
           ]
           res.status(200).json(val).end()
        }, err => {
           res.status(500).json(err).end()
        })
      }
   };

   dialogo.deletar = function (req,res) {
     var id = req.params.id;
     var db = req.app.get("database");
     var dialogo = db.collection("dialogo");
     dialogo.remove(id)
     .then(val => {
        val._links = [
          {rel : "adicionar", method: "POST", href: "http://191.252.109.164/dialogos"},
          {rel : "listar", method: "GET", href: "http://191.252.109.164/dialogos"}
        ]
        res.status(200).json(val).end()
     }, err => {
        res.status(500).json(err).end()
     })
   }

   return dialogo;
}
