var express = require('express');
var app = express();
var fs = require('fs');
var template = require('./lib/template');
var bodyParser = require('body-parser');
var compression = require('compression');
var topicRouter = require('./routes/topic');

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(compression());
app.get('*', function(req, res, next) {
  fs.readdir('./data', function(error, filelist) {
    req.list = filelist;
    next();
  });
});

app.use('/topic', topicRouter);

// route, routing
app.get('/', (req, res) => {
  console.log(req.list);
  var title = 'Welcome';
  var description = 'Hello, Node.js';
  var list = template.list(req.list);
  var html = template.HTML(
    title,
    list,
    `<h2>${title}</h2>${description},
    <img src='/images/jimin.jpeg' style='width:300px; display:block'/>
    <a href="/topic/create">create</a>`
  );
  res.send(html);
});
// app.get('/', function(req, res) {
//   return res.send('Hello World!');
// })

app.use(function(req, res, next) {
  res.status(404).send('Sorry cant find that!');
});

app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(3000, () => console.log('Example app listening on port 3000!'));
