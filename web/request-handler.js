var path = require('path');
var archive = require('../helpers/archive-helpers');
var helpers = require('./http-helpers.js');
var fs = require('fs');
var url = require('url');
// require more modules/folders here!

var indexPage = './web/public/index.html';
var loadingPage = './web/public/loading.html';

var renderPage = function(res, page) {
  fs.readFile(page, function(err, data) {
    helpers.sendResponse(res, data);
  });
};

var actions = {

  'GET': function(req, res) {
    var urlPath = url.parse(req.url).pathname;
    // if the url /, make it equal to /index.html
    if (urlPath === '/') { urlPath = '/index.html'; }

    helpers.serveAssets(res, urlPath, function() {
      // trim leading slash if present
      if (urlPath[0] === '/') { urlPath = urlPath.slice(1); }

      archive.isUrlInList(urlPath)
      .then(function() {
        helpers.sendRedirect(res, '/loading.html');
      }).catch(function() {
        helpers.send404(res);
      });
    });
  },

  'POST': function(req, res) {
    // gets the URL
    helpers.collectUrl(req, function(url) {
      archive.isUrlInList(url)
      .then(function(url) {
        archive.isUrlArchived(url)
        .then(function(url) {
          helpers.sendRedirect(res, '/' + url);
        }).catch(function(err) {
          helpers.sendRedirect(res, '/loading.html');
        });
      }).catch(function() {
        archive.addUrlToList(url)
        .then(function(url) {
          helpers.sendRedirect(res, '/loading.html');
        });
      });
    });
  },

  // 'OPTIONS': function(req, res) {
  //   helpers.sendResponse(res, null);
  // }

};

exports.handleRequest = function (req, res) {
  console.log(req.method);
  var action = actions[req.method];
  if (action) {
    action(req, res);
  } else {
    helpers.sendResponse(res, '', 404);
  }
};