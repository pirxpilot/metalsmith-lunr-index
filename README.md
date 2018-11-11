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

metalsmith.use(lunr());

```

## Options
By passsing in certain properties, you can change the behaviour.

| option         | meaning           |
| -------------- | ----------------- |
| `pattern`      | Glob pattern for selecting files to index ***default: ['\*\*/\*.html']*** |
| `indexPath`    | Output path for the index ***default: search-index.json***  |
| `removeStemmer`| `true` or `false`, removes the stemmer from the indexing pipeline   |
| `refKey`       | property to be used as `ref` - if not defined path is used    |

## Client Side Search

Metalsmith-lunr-index will generate search-index.json. Include [lunr.js](https://raw.githubusercontent.com/olivernn/lunr.js/master/lunr.min.js) in your javascript source files. Client side search example can be found [here](http://lunrjs.com/example/).

Once the JSON file has been parsed into javascript, simply run the following:
```js
//index is the parsed JSON file
var idx = lunr.Index.load(index);
var results = idx.search("Your Search Terms Here");
```
