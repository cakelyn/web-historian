var path = require('path');
var fs = require('fs');
var archive = require('../helpers/archive-helpers');

exports.headers = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10, // Seconds.
  'Content-Type': 'text/html'
};

exports.sendResponse = function(res, url, status) {
  var status = status || 200;
  res.writeHead(status, exports.headers);
  res.end(url);
};

exports.send404 = function(res, url) {
  exports.sendResponse(res, '404: Page Not Found', 404);
};

exports.collectUrl = function(req, callback) {
  var url = '';
  req.on('data', function(chunk) {
    url += chunk;
  });
  req.on('end', function() {
    // slice unecessary characters off url
    url = url.split('=')[1];
    callback(url);
  });
};

exports.sendRedirect = function(response, location, status) {
  status = status || 302;
  response.writeHead(status, {Location: location});
  response.end();
};

exports.serveAssets = function(res, asset, callback) {
  // look inside public sites
  fs.readFile(archive.paths.siteAssets + asset, 'utf8', function(err, data) {
    // if it doesn't exist
    if (err) {
      // check archives
      fs.readFile(archive.paths.archivedSites + asset, 'utf8', function(err, data) {
        // if it doesn't exist
        if (err) {
          // send 404 response
          callback ? callback() : exports.send404(res);
        } else {
          exports.sendResponse(res, data);
        }
      });
    } else {
      exports.sendResponse(res, data);
    }
  });
};
