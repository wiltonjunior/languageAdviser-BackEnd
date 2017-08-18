module.exports = function (app) {
    var fs = app.get("fs");

    app.get("/imagem",function (req,res) {
       fs.readdir("./public/imagem",function (err,files) {
          if (err) {
             console.log(err);
          }
          else {
            res.render("imagem.ejs",{files : files});
          }
       });
    });
    app.get("/imagem/idioma",function (req,res) {
       fs.readdir("./public/imagem/idioma",function (err,files) {
          if (err) {
             console.log(err);
          }
          else {
             res.render("idioma.ejs",{files : files});
          }
       });
    });
}
