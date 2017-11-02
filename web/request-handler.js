var path = require('path');
var archive = require('../helpers/archive-helpers');
var helpers = require('./http-helpers.js');
var fs = require('fs');
// require more modules/folders here!

var sendResponse = function(res, url, status) {
  var status = status || 200;
  res.writeHead(status, helpers.headers);
  res.end(url);
};

var collectUrl = function(req, callback) {
  var url = '';
  req.on('data', function(chunk) {
    url += chunk;
  });
  req.on('end', function() {
    callback(url);
  });
};

var actions = {
  'GET': function(req, res) {
    // return the content of index.html
    // should return the content of a website from the archive
    fs.readFile('./web/public/index.html', function(err, data) {
      sendResponse(res, data);
    });

  },
  'POST': function(req, res) {
    // append submitted sites to sites.txt
    collectUrl(req, function(url) {
      // if data is not in sites.txt
      // show loading.html
      sendResponse(res, url.slice(4), 201);
    });
  },
  'OPTIONS': function(req, res) {
    sendResponse(res, null);
  }
};

exports.handleRequest = function (req, res) {
  var action = actions[req.method];

  if (action) {
    action(req, res);
  } else {
    sendResponse(res, '', 404);
  }
};