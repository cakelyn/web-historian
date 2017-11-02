var fs = require('fs');
var path = require('path');
var _ = require('underscore');

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
  fs.readFile(exports.paths.list, 'utf-8', function(err, data){
    if(err) {
      console.log('error', error);
    }
    console.log(data);
    callback(data.split('\n'));

  });
};

exports.isUrlInList = function(url, callback) {
  // should check if a URL is in the list
  fs.readFile(exports.paths.list, function(err, data) {
    if (err) {
      console.log(err);
    }
    callback(data);
  });

  // var urlList = exports.readListOfUrls(callback);
  // if(urlList.includes(url)){
  //   callback(true);
  // }
  // callback(false);
};

exports.addUrlToList = function(url, callback) {
  // should add a URL to the list
  fs.writeFile(exports.paths.list, url, function(err, data) {
    console.log(data);
  });
};

exports.isUrlArchived = function(url, callback) {
  // should check if a URL is archived
};

exports.downloadUrls = function(urls) {
  // should download all pending URLs in the list
};
