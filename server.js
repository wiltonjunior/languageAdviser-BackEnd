var http = require("http");
var app = require("./config/express.js")();

http.createServer(app).listen(3000, function () {
   console.log("Servidor Rodando");
});
