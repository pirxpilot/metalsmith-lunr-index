const lunr = require('lunr');
const multimatch = require('multimatch');
const sanitizeHtml = require('sanitize-html');

module.exports = plugin;

function plugin({
  pattern = ['**/*.html'],
  indexPath = 'search-index.json',
  removeStemmer
} = {}) {

  return function(files) {

    const store = {};

    //Build the index using the documents
    const index = lunr(function() {
      const lunr = this;

      lunr.ref('path');
      lunr.field('body');
      lunr.field('title');

      lunr.metadataWhitelist = ['position'];

      if (removeStemmer) {
        lunr.pipeline.remove(lunr.stemmer);
      }

      // Assemble documents from metalsmith files
      Object.entries(files).forEach(function([ path, { contents, title } ]) {
        if (!multimatch(path, pattern).length) { return; }

        let body = sanitizeHtml(contents, { allowedTags: [], allowedAttributes: []})
          .replace(/[\n\r\t]+/g, ' ') // Strip newline and carriage return symbols
          .replace(/\s+/g, ' '); //Strip extra spaces

        lunr.add({ path, body, title });
        store[path] = { title, body };
      });
    });

    // Write the index JSON to the metalsmith metadata for build, along with the documents
    files[indexPath] = {
      contents: JSON.stringify({ store, index })
    };
  };
}
