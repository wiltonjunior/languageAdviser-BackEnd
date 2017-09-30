module.exports = function (app) {
  var fs = app.get("fs");

  var arquivo = {};

  arquivo.diretorioImagem = function (req,res) {
     fs.readdir("./public/imagem", async function (err,files) {
        if (err) {
           res.status(500).json(err);
        }
        else {
           res.status(200).json(files);
        }
     })
  };

  arquivo.diretorioAdministrador = function (req,res) {
    fs.readdir("./public/imagem/administrador", function (err,files) {
       if(err) {
         res.status(500).json(err);
       }
       else {
         res.status(200).json(files);
       }
    })
  };

  arquivo.diretorioAluno = function (req,res) {
    fs.readdir("./public/imagem/aluno", function (err,files) {
      if (err) {
        res.status(500).json(err);
      }
      else {
        res.status(200).json(files);
      }
    })
  };

  arquivo.diretorioAutor = function (req,res) {
    fs.readdir("./public/imagem/autor", function (err,files) {
       if (err) {
         res.status(500).json(err);
       }
       else {
         res.status(200).json(files);
       }
    })
  };

  arquivo.diretorioIdioma = function (req,res) {
    fs.readdir("./public/imagem/idioma", function (err,files) {
      if (err) {
        res.status(500).json(err);
      }
      else {
        res.status(200).json(files);
      }
    })
  };

  arquivo.diretorioNivel = function (req,res) {
     fs.readdir("./public/imagem/nivel", function (err,files) {
        if (err) {
           res.status(500).json(err);
        }
        else {
          res.status(200).json(files);
        }
     })
  };

  arquivo.diretorioSituacao = function (req,res) {
     fs.readdir("./public/imagem/situacao", function (err,files) {
        if (err) {
           res.status(500).json(err);
        }
        else {
          res.status(200).json(files);
        }
     })
  }


  return arquivo;

}
