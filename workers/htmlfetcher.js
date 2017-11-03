// Use the code in `archive-helpers.js` to actually download the urls
// that are waiting.
var archive = require('../helpers/archive-helpers');

// check list for urls
// download urls
console.log('fetching html');
archive.readListOfUrls(archive.downloadUrls);