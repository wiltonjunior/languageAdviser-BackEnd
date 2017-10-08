var passport = require("passport");
var passportJWT = require("passport-jwt");
const database = require("./database")();

module.exports = function () {
  var params = {
    secretOrKey : "MyS3cr3tK3Y",
    jwtFromRequest : passportJWT.ExtractJwt.fromAuthHeaderWithScheme('jwt')
  };

  var strategy = new passportJWT.Strategy(params, async function (jwt_payload,done) {
      var usuario = await database.query("FOR usuario IN usuario FILTER usuario._key == @id RETURN usuario",{'id' : jwt_payload});
      if(usuario._result[0]==null) {
         var administrador = await database.query("FOR administrador IN administrador FILTER administrador._key == @id RETURN administrador",{'id' : jwt_payload});
         if(administrador._result[0]==null) {
            return done(null,false);
         }
         else {
            return done(null,administrador._result[0]);
         }
      }
      else {
        return done(null,usuario._result[0]);
      }
  });

  passport.use(strategy);

  return {
    initialize : function () {
       return passport.initialize();
    },
    authenticate : function () {
       return passport.authenticate("jwt",{session : false});
    }
  }

}
