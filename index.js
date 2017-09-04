var
  lunr = require('lunr'),
  multimatch = require('multimatch'),
  sanitizeHtml = require('sanitize-html');

module.exports = plugin;

function plugin(opts) {
  opts = opts || {};
  opts.pattern = opts.pattern || ['**/*.html'];
  opts.indexPath = opts.indexPath || 'search-index.json';
  opts.removeStemmer = opts.removeStemmer || false;

  return function(files, metalsmith, done) {
    
    var documents = [],
        store = {};
    // Assemble documents from metalsmith files
    Object.keys(files).forEach(function(f) {
      var data = files[f];
      if (multimatch(f, opts.pattern).length) {
        documents.push({
          'path': data.path,
          'body': sanitizeHtml(data.contents, { allowedTags: [], allowedAttributes: []})
                  .replace(/[\n\r\t]+/g, ' ') // Strip newline and carriage return symbols
                  .replace(/\s+/g, ' '), //Strip extra spaces
          'title': data.title,
        });
      }
    });

    //Build the index using the documents
    var idx = lunr(function() {
      this.ref('path');
      this.field('body');
      this.field('title');

      this.metadataWhitelist = ['position']

      if(opts.removeStemmer){
        this.pipeline.remove(lunr.stemmer);
      }
      
      documents.forEach(function(doc) {
        this.add(doc);
        // Format the store correctly
        store[doc.path] = { 'title': doc.title, 'body' : doc.body };
      }, this, store);
    });
    //Write the index JSON to the metalsmith metadata for build, along with the documents
    files[opts.indexPath] = {
      contents: JSON.stringify({ store: store, index: idx })
    };
    done();
  };
};