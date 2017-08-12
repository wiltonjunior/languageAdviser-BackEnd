var path = require("path");

module.exports = function (app) {
   app.post("/teste", function (req,res) {
     var fs = app.get("fs");
     var formidable = app.get("formidable");
     var form = new formidable.IncomingForm();
     form.parse(req,function (err,fields,files) {
       var oldpath = files.photo.path;
       var tipo = path.extname(files.photo.name);
       var newpath = "./public/imagem/idioma/" + files.photo.name;
       fs.rename(oldpath,newpath, function (err) {
          if (err) {
             res.send("<html><head></head><body>Erro</body></html>");
          }
          else {
             res.send("<html><head></head><body>OK</body></html>");
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
