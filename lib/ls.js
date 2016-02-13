var fs = require('fs'),
    path = require('path'),
    moment = require('moment'),
    fm = require('front-matter'),
    sort = require('sort-by'),
    marked = require('marked');

module.exports = (root, french, files) => {
  return files.map((file) => {
    var dateFormated = file.replace('.md', '');
    var date;
    if (french) {
      date = moment(dateFormated, 'DD-MM-YY');
    } else {
      date = moment(dateFormated, 'MM-DD-YY');
    }
    var content = fm(fs.readFileSync(path.join(root, file), 'utf8'));
    content.attributes.date = moment(date).format('dddd, MMMM Do YYYY');
    content.body = marked(content.body);
    return {date: date, attributes: content.attributes, body: content.body, url: dateFormated};
  }).sort(sort('-date'));
};
