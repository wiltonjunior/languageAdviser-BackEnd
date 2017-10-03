var jwt = require("jwt-simple");

module.exports = function (app) {
    var auth = app.get("auth");

    app.post("/token", function (req,res) {
        var dados = req.body;
        var token = jwt.encode(dados.email,"MyS3cr3tK3Y");
        res.status(200).json(token);
    });

    app.get("/token", auth.authenticate(), function (req,res) {
        res.status(200).json({"Nome" : "Teste"});
    });
}
