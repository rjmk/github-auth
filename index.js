var http = require('http');
var https = require('https');
var querystring = require('querystring');

var sessions = {};

function handler (req, res) {
  if (req.url === '/') {
    rootHandler(req, res);
  } else if (req.url.match('/login')){
    var code = req.url.split('code=')[1];
    var postData = querystring.stringify({
      client_id: '32b5ea24fcfcd95e7daf',
      client_secret: '67b8684cae11d2c701140af93a9242b63588287e',
      code: code
    });
    var req = https.request({
      hostname: 'github.com',
      path: '/login/oauth/access_token',
      method: 'POST'
    }, function (responseFromGithub) {
      console.log(responseFromGithub.statusCode, responseFromGithub.headers)
      responseFromGithub.on('data', function (chunk) {
        var accessToken = chunk.toString().split('access_token=')[1].split('&')[0]
        var cookie = Math.floor(Math.random() * 100000000);
        sessions[cookie] = accessToken;
        res.writeHead(200, {
          "Set-Cookie": 'access=' + cookie
        });
        res.end('Logged in');
      });
    }).end(postData)
  } else if (req.url === '/show-me') {
    res.end(req.headers.cookie + ' ' + sessions[req.headers.cookie.split('access=')[1]])
  }
}

function rootHandler(req, res) {
  res.end('<a href=https://github.com/login/oauth/authorize?client_id=32b5ea24fcfcd95e7daf>LOGIN</a>')
}
http.createServer(handler).listen(8000);