var path = require('path');
var archive = require('../helpers/archive-helpers');
var helpers = require('./http-helpers.js');
var fs = require('fs');
// require more modules/folders here!

var indexPage = './web/public/index.html';
var loadingPage = './web/public/loading.html';

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
    // slice unecessary characters off url
    console.log(url);
    url = url.slice(4);
    callback(url);
  });
};

var renderPage = function(res, page) {
  fs.readFile(page, function(err, data) {
    sendResponse(res, data);
  });
};

var actions = {
  'GET': function(req, res) {
    // return the content of index.html
    renderPage(res, indexPage);
    // should return the content of a website from the archive
  },
  'POST': function(req, res) {
    // append submitted sites to sites.txt
    collectUrl(req, function(url) {
      // if url is not in sites.txt
      archive.isUrlInList(url, function(data) {
        // if the URL is present but site hasn't been archived yet
        if (data.indexOf(url + '*') >= 0) {
          // show loading page
          renderPage(res, loadingPage);
        // if the URL is present and site is archived
        } else if (data.indexOf(url) >= 0) {
          // show the archived site
          sendResponse(res, url, 201);
        // site is not listed
        } else {
          // add site to list with asterisk
          archive.addUrlToList(url + '*');
          // show loading page
          renderPage(res, loadingPage);
          // invoke htmlfetcher
        }
      });
    });
  },
  'OPTIONS': function(req, res) {
    sendResponse(res, null);
  }
};

exports.handleRequest = function (req, res) {
  console.log(req.method);
  var action = actions[req.method];
  if (action) {
    action(req, res);
  } else {
    sendResponse(res, '', 404);
  }
};