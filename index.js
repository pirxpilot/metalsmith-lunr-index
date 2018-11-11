const lunr = require('lunr');
const multimatch = require('multimatch');
const strip = require('strip');

module.exports = plugin;

function plugin({
  pattern = ['**/*.html'],
  refKey,
  indexPath = 'search-index.json',
  removeStemmer
} = {}) {

  return function(files) {

    const store = {};

    //Build the index using the documents
    const index = lunr(function() {
      const lunr = this;

      lunr.ref('ref');
      lunr.field('body');
      lunr.field('title');

      lunr.metadataWhitelist = ['position'];

      if (removeStemmer) {
        lunr.pipeline.remove(lunr.stemmer);
      }

      // Assemble documents from metalsmith files
      Object.entries(files).forEach(function([ path, file ]) {
        if (!multimatch(path, pattern).length) { return; }

        const { contents, title } = file;
        const ref = refKey ? file[refKey] : path;
        // strip HTML and whitespace
        let body = strip(contents.toString()).replace(/\s+/gim, ' ');

        lunr.add({ ref, body, title });
        store[ref] = { title, body };
      });
    });

    // Write the index JSON to the metalsmith metadata for build, along with the documents
    files[indexPath] = {
      contents: JSON.stringify({ store, index })
    };
  };
}
