var express = require('express');
var router = express.Router();
var template = require('../lib/template');

// route, routing
router.get('/', (req, res) => {
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

module.exports = router;
