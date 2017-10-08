var jwt = require("jwt-simple");

module.exports = function (app) {
    var auth = app.get("auth");
    var db = app.get("database");

    app.post("/token", function (req,res) {
        var dados = req.body;
        db.query("FOR usuario IN usuario FILTER usuario.emailUsuario == @email and usuario.senhaUsuario == @senha RETURN usuario",{'email' : dados.email,'senha' : dados.senha})
        .then(cursor => {
           cursor.next()
           .then(val => {
              if(val==null) {
                 var resposta = {"mensagem" : "Usuario não encontrado"};
                 res.status(404).json(resposta).end()
              }
              else {
                var token = "JWT " + jwt.encode(val._key,"MyS3cr3tK3Y");
                res.status(200).json({"Token" : token}).end()
              }
           }, err => {
              res.status(500).json(err).end()
           })
        })
    });

    app.get("/token", auth.authenticate(), function (req,res) {
        res.status(200).json({"Nome" : "Teste"});
    });
}
