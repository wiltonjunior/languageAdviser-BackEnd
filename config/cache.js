var nodeCache = require("node-cache");

module.exports = function () {
   var cache = new nodeCache({stdTTL:10});



   return cache;
}
