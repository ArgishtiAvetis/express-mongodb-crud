const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const mongojs = require('mongojs');
var ObjectId = mongojs.ObjectId;
var db = mongojs('mynicknames', ['nicknames']);
const port = 3000;

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use((req, res, next) => {
  res.locals.errors = null;
  next();
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));
//
// var nicknames = [
//   {
//     id: 1,
//     name: 'Argishti'
//   },
//   {
//     id: 2,
//     name: 'Argi'
//   },
//   {
//     id: 3,
//     name: 'Arg'
//   },
//   {
//     id: 4,
//     name: 'Aguch'
//   }
// ];

app.get('/', (req, res) => {
  // find everything
  db.nicknames.find(function (err, docs) {
  	// docs is an array of all the documents in mycollection
    res.render('index', {
      title: 'Nicknames',
      nicknames: docs
    });
  });

});

app.post('/add', (req, res) => {
  req.checkBody('nickname', 'Nickname is required').notEmpty();
  var errors = req.validationErrors();
  if (errors) {
    db.nicknames.find(function (err, docs) {
      // docs is an array of all the documents in mycollection
      res.render('index', {
        title: 'Nicknames',
        nicknames: docs,
        errors: errors
      });
    });
  } else {
    errors = '';
    db.nicknames.insert({
      nickname: req.body.nickname
    }, (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.redirect('/');
      }
    });
  }

});

app.delete('/delete/:id', (req, res) => {
  db.nicknames.remove({
    _id: ObjectId(req.params.id)
  }, (err, result) => {
    if (err) {
      console.log(err);
    }
    res.redirect('/');
  });

});

app.listen(port, () => {
  console.log(`App running on port ${port}`);
});








//
