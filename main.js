var express = require('express');
var app = express();
var fs = require('fs');
var template = require('./lib/template');
var path = require('path');
var sanitizeHtml = require('sanitize-html');
var qs = require('querystring');
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));

// route, routing
app.get('/', (req, res) =>
  fs.readdir('./data', function(error, filelist) {
    var title = 'Welcome';
    var description = 'Hello, Node.js';
    var list = template.list(filelist);
    var html = template.HTML(
      title,
      list,
      `<h2>${title}</h2>${description}`,
      `<a href="/create">create</a>`
    );
    res.send(html);
  })
);
// app.get('/', function(req, res) {
//   return res.send('Hello World!');
// })

app.get('/page/:pageId', (req, res) =>
  fs.readdir('./data', function(error, filelist) {
    var filteredId = path.parse(req.params.pageId).base;
    fs.readFile(`data/${filteredId}`, 'utf8', function(err, description) {
      var title = req.params.pageId;
      var sanitizedTitle = sanitizeHtml(title);
      var sanitizedDescription = sanitizeHtml(description, {
        allowedTags: ['h1']
      });
      var list = template.list(filelist);
      var html = template.HTML(
        sanitizedTitle,
        list,
        `<h2>${sanitizedTitle}</h2>${sanitizedDescription}`,
        ` <a href="/create">create</a>
          <a href="/update/${sanitizedTitle}">update</a>
          <form action="/delete" method="post">
            <input type="hidden" name="id" value="${sanitizedTitle}">
            <input type="submit" value="delete">
          </form>`
      );
      res.send(html);
    });
  })
);

app.get('/create', (req, res) => {
  fs.readdir('./data', function(error, filelist) {
    var title = 'WEB - create';
    var list = template.list(filelist);
    var html = template.HTML(
      title,
      list,
      `
        <form action="/create" method="post">
          <p><input type="text" name="title" placeholder="title"></p>
          <p>
            <textarea name="description" placeholder="description"></textarea>
          </p>
          <p>
            <input type="submit">
          </p>
        </form>
      `,
      ''
    );
    res.send(html);
  });
});

app.post('/create', (req, res) => {
  /*
  var body = '';
  req.on('data', function(data) {
    body = body + data;
  });
  req.on('end', function() {
    var post = qs.parse(body);
    var title = post.title;
    var description = post.description;
    fs.writeFile(`data/${title}`, description, 'utf8', function(err) {
      res.redirect(`/page/${title}`);
    });
  });
  */
  var post = req.body;
  var title = post.title;
  var description = post.description;
  fs.writeFile(`data/${title}`, description, 'utf8', function(err) {
    res.redirect(`/page/${title}`);
  });
});

app.get('/update/:pageId', (req, res) => {
  fs.readdir('./data', function(error, filelist) {
    var filteredId = path.parse(req.params.pageId).base;
    fs.readFile(`data/${filteredId}`, 'utf8', function(err, description) {
      var title = req.params.pageId;
      var list = template.list(filelist);
      var html = template.HTML(
        title,
        list,
        `
      <form action="/update" method="post">
        <input type="hidden" name="id" value="${title}">
        <p><input type="text" name="title" placeholder="title" value="${title}"></p>
        <p>
          <textarea name="description" placeholder="description">${description}</textarea>
        </p>
        <p>
          <input type="submit">
        </p>
      </form>
      `,
        `<a href="/create">create</a> <a href="/update/${title}">update</a>`
      );
      res.send(html);
    });
  });
});

app.post('/update', (req, res) => {
  var post = req.body;
  var id = post.id;
  var title = post.title;
  var description = post.description;
  fs.rename(`data/${id}`, `data/${title}`, function(error) {
    fs.writeFile(`data/${title}`, description, 'utf8', function(err) {
      res.redirect(`/page/${title}`);
    });
  });
});

app.post('/delete', (req, res) => {
  var post = req.body;
  var id = post.id;
  var filteredId = path.parse(id).base;
  fs.unlink(`data/${filteredId}`, function(error) {
    res.redirect('/');
  });
});

app.listen(3000, () => console.log('Example app listening on port 3000!'));
