# metalsmith-lunr-index

A [Metalsmith](https://github.com/segmentio/metalsmith) plugin that integrates the [Lunr.js](http://lunrjs.com/) client side search engine.

Builds a searchable JSON index based on Metalsmith metadata.

Made because [metalsmith-lunr](https://github.com/CMClay/metalsmith-lunr) does not work with Lunr 2.0.

## Installation

    $ npm install metalsmith-lunr-index

## Usage
Include metalsmith-lunr-index in your metalsmith pipeline.

Metalsmith-lunr can be used without options:
```js
var lunr = require('metalsmith-lunr-index');

metalsmith.use(lunr()).
```
*N.B. I am aware that this includes the full body of the page. This is for a basic implementation of full-body search with a small site. I will move this under a flag at a future point*

##Client Side Search

Metalsmith-lunr-index will generate searchIndex.json. Include [lunr.js](https://raw.githubusercontent.com/olivernn/lunr.js/master/lunr.min.js) in your javascript source files. Client side search example can be found [here](http://lunrjs.com/example/).

Once the JSON file has been parsed into javascript, simply run the following:
```js
//index is the parsed JSON file
idx = lunr.Index.load(index)
var results = idx.search("Your Search Terms Here");
```
