module.exports = function (app) {
   var model = app.model.empresa;
   var Joi = app.get("joi");
   var db = app.get("database");
   var dbEmpresa = db.collection("empresa");

   var empresa = {};

   var versao = "/v1";

   empresa.salvar = async function (req,res) {
      var dados = req.body;
      var result = Joi.validate(dados,model);
      if(result.error!=null) {
        res.status(400).json(result.error);
      }
      else {
        var googleMaps = req.app.get("googleMaps");
        googleMaps.geocode({
          address : dados.cidade + "," + dados.estado + "," + dados.pais
        }, async function (err,result) {
            if(err) {
              var resultado = await salvarEmpresa(req,dados);
              if(resultado==null) {
                res.status(500).json();
              }
              else {
                res.status(201).json(resultado);
              }
            }
            else {
              dados.latitude = result.json.results[0].geometry.location.lat;
              dados.longitude = result.json.results[0].geometry.location.lng;
              var resultado = await salvarEmpresa(req,dados);
              if(resultado==null) {
                res.status(500).json();
              }
              else {
                res.status(201).json(resultado);
              }
            }
        });
      }
   };

   async function salvarEmpresa(req,dados) {
      var resultados = await dbEmpresa.save(dados);
      resultados._links = [
        {rel : "procurar", method : "GET", href: "http://" + req.headers.host + versao + "/empresas/" + resultados._key},
        {rel : "atualizar", method : "PUT", href: "http://" + req.headers.host + versao + "/empresas/" + resultados._key},
        {rel : "excluir", method : "DELETE", href: "http://" + req.headers.host + versao + "/empresas/" + resultados._key}
      ];
      return resultados;
   }

   empresa.listar = function (req,res) {
      dbEmpresa.all()
      .then(cursor => {
        cursor.all()
        .then(val => {
          var links = {
            _links : [
              {rel : "adicionar", method: "POST", href: "http://" + req.headers.host + versao + "/empresas"},
              {rel : "listar", method: "GET", href: "http://" + req.headers.host + versao + "/empresas"}
            ]
          };
          val.push(links);
          res.status(200).json(val).end();
        });
      });
   };

   empresa.listarEmpresa = function (req,res) {
      var id = req.params.id;
      dbEmpresa.document(id)
      .then(val => {
        val._links = [
          {rel : "adicionar", method: "POST", href: "http://" + req.headers.host + versao + "/empresas"},
          {rel : "editar", method: "PUT", href: "http://" + req.headers.host + versao + "/empresas/" + val._key},
          {rel : "excluir", method: "DELETE", href: "http://" + req.headers.host + versao + "/empresas/" + val._key}
        ]
        res.status(200).json(val).end()
      }, err => {
         res.status(500).json(err).end()
      });
   };

   empresa.editar = function (req,res) {
      var id = req.params.id;
      var dados = req.body;
      var result = Joi.validate(dados,model);
      if(result.error!=null) {
         res.status(400).json(result.error);
      }
      else {
        var googleMaps = req.app.get("googleMaps");
        googleMaps.geocode({
          address : dados.cidade + "," + dados.estado + "," + dados.pais
        }, async function (err,result) {
            if(err) {
              var resultado = await editarEmpresa(req,id,dados);
              if(resultado==null) {
                res.status(500).json();
              }
              else {
                res.status(201).json(resultado);
              }
            }
            else {
              dados.latitude = result.json.results[0].geometry.location.lat;
              dados.longitude = result.json.results[0].geometry.location.lng;
              var resultado = await editarEmpresa(req,id,dados);
              if(resultado==null) {
                res.status(500).json();
              }
              else {
                res.status(201).json(resultado);
              }
            }
        });
      }
   };

   async function editarEmpresa(req,id,dados) {
      var resultados = await dbEmpresa.update(id,dados);
      resultados._links = [
        {rel : "adicionar", method: "POST", href: "http://" + req.headers.host + versao + "/empresas"},
        {rel : "listar", method: "GET", href: "http://" + req.headers.host + versao + "/empresas"},
        {rel : "procurar", method: "GET", href: "http://" + req.headers.host + versao + "/empresas/" + dados._key},
        {rel : "excluir", method: "DELETE", href: "http://" + req.headers.host + versao + "/empresas"}
      ];
      return resultados;
   }

   empresa.deletar = function (req,res) {
      var id = req.params.id;
      dbEmpresa.remove(id)
      .then(val => {
        val._links = [
          {rel : "adicionar", method: "POST", href: "http://" + req.headers.host + versao + "/empresas"},
          {rel : "listar", method: "GET", href: "http://" + req.headers.host + versao + "/empresas"}
        ]
        res.status(200).json(val).end()
      }, err => {
         res.status(500).json(err).end()
      });
   }

   return empresa;
}
