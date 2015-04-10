var redis;

if (process.env.REDISTOGO_URL) {
  var rtg   = require('url').parse(process.env.REDISTOGO_URL);
  redis = require('redis').createClient(rtg.port, rtg.hostname);
  redis.auth(rtg.auth.split(":")[1]);
} else {
  redis = require('redis').createClient();
}

var Promise = require('bluebird');
var sha1 = require('node-sha1');

Promise.promisifyAll(redis);

var cacheMiddleware = function cacheMiddleware(param, middleware, expires) {
  return function(request, response, next) {
    var key = 'cache:' + param + ':' + sha1(JSON.stringify(request.params));
    redis.getAsync(key).then(function(value) {
      if (value !== null) {
        request[param] = JSON.parse(value);
        next();
        return;
      }
      middleware(request, response, function() {
        // we do not need to wait for this to complete before continuing the
        // request
        redis.setAsync(key, JSON.stringify(request[param]));
        redis.expireAsync(key, expires);
        next();
      });
    });
  };
};

module.exports = cacheMiddleware;