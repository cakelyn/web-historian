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

exports.readListOfUrls = function() {
  // should read URLs from sites.txt
  // callback should trigger downloadURLS ***********
  return new Promise(function(resolve, reject) {
    fs.readFile(exports.paths.list, 'utf-8', function(err, data){
      if(err) {
        reject(err);
      }
      resolve(data.split('\n'));
    });
  });
};

exports.isUrlInList = function(url) {
  // should check if a URL is in the list, output should be boolean
  return new Promise(function(resolve, reject) {
    exports.readListOfUrls()
      // go through urls list
      .then(function(urls) {
        var found = _.any(urls, function(site, i) {
          return site.match(url);
        });
        if (found) {
          resolve(url);
        } else {
          reject();
        }
      });
    });
};

exports.addUrlToList = function(url) {
  // if url is not in list, should add a URL to the list
  return new Promise(function(resolve, reject) {
    fs.appendFile(exports.paths.list, url + '\n', function(err) {
      if (err) {
        reject(err);
      }
    });
    console.log(url, 'saved');
    resolve(url);
  });
};

exports.isUrlArchived = function(url) {
  // should check if a URL is archived
  // use exports.paths to check contents of sites folder
  return new Promise(function(resolve, reject) {
    var sitePath = path.join(exports.paths.archivedSites, url);
    fs.access(sitePath, function(err) {
      if (err) {
        reject(err);
      } else {
        resolve(url);
      }
    });
  });
};

exports.downloadUrls = function(urls) {
  _.each(urls, function (url) {
    if (!url) { return; }
    request('http://' + url).pipe(fs.createWriteStream(exports.paths.archivedSites + '/' + url));
  });
};
