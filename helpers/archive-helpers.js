var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var request = require('request');
/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

exports.paths = {
  siteAssets: path.join(__dirname, '../web/public'),
  archivedSites: path.join(__dirname, '../archives/sites'),
  list: path.join(__dirname, '../archives/sites.txt'),
  index: path.join(__dirname, '../web/public/index.html')
};

// Used for stubbing paths for tests, do not modify
exports.initialize = function(pathsObj) {
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!

exports.readListOfUrls = function(callback) {
  // should read URLs from sites.txt
  // callback should trigger downloadURLS ***********

  fs.readFile(exports.paths.list, 'utf-8', function(err, data){
    if(err) {
      console.log('error', error);
    }
    callback(data.split('\n'));
  });
};

exports.isUrlInList = function(url, callback) {
  // should check if a URL is in the list, output should be boolean
  exports.readListOfUrls(function(urlsList) {
    // go through urls list
    var found = _.any(urlsList, function(site, i) {
      return site.match(url);
    });
    callback(found);
  });

};

exports.addUrlToList = function(url, callback) {
  // if url is not in list, should add a URL to the list
  fs.appendFile(exports.paths.list, url + '\n', function(err) {
    if (err) {
      console.log(err);
    }
    console.log(url, 'saved');
    callback();
  });
};

exports.isUrlArchived = function(url, callback) {
  // should check if a URL is archived
  // use exports.paths to check contents of sites folder
  var sitePath = path.join(exports.paths.archivedSites, url);
  fs.access(sitePath, function(err) {
    callback(!err);
  });
};

exports.downloadUrls = function(urls) {

  _.each(urls, function (url) {
    if (!url) { return; }
    request('http://' + url).pipe(fs.createWriteStream(exports.paths.archivedSites + '/' + url));
  });
};
