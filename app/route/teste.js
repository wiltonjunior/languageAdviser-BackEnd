var path = require("path");

module.exports = function (app) {
   app.post("/teste", function (req,res) {
     var fs = app.get("fs");
     var formidable = app.get("formidable");
     var form = new formidable.IncomingForm();
     form.parse(req,function (err,fields,files) {
       var oldpath = files.imagem.path;
       var tipo = path.extname(files.imagem.name);
       console.log(tipo);
       var newpath = "./public/imagem/idioma/" + files.imagem.name;
       fs.rename(oldpath,newpath, function (err) {
          if (err) {
             console.log(err);
          }
          else {
             console.log("OK");
          }
       });
     });
   });

   app.get("/teste",function (req,res) {
      var fs = app.get("fs");
      fs.readFile("./public/imagem/idioma/","base64",function (err,fotos) {
         if (fotos!=null) {
           res.json(fotos,[]);
         }
         else {
            res.json({},[]);
         }
      });
   })
}
