const express = require('express');
const app = express();
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

//Map global promise - get rid of warning
mongoose.Promise = global.Promise;

//connect to mongoose
mongoose.connect('mongodb://localhost/vidjot-dev')
  .then(() => console.log('MongoDB connected....'))
  .catch(err => console.log(err));

//Load Idea model
require('./models/Idea');
const Idea = mongoose.model('ideas');

 /*//How middleware works
app.use((req, res, next) => {
  console.log(Date.now());
  //you can make var and put value
  next();
}); */

//handlebars Middleware
app.engine('handlebars', exphbs({
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

// Body Parser Middlewae
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

//Index Route
app.get('/', (req, res) => {
  const title = 'Welcome';
  res.render('index',{
    title : title
  });

});

//About Route
app.get('/about', (req, res) => {
  res.render('about');
});

//Idea Index Page
app.get('/ideas', (req, res) => {
  Idea.find({})
    .sort({date:'desc'})
    .then(ideas => {
      res.render('ideas/index', {
        ideas:ideas
      });
    });
});

//Add Idea From
app.get('/ideas/add', (req, res) => {
  res.render('ideas/add');
});

//Process From
app.post('/ideas', (req, res) => {
  let errors = [];
  if(!req.body.title) {
    errors.push({text: 'Please Add Title For Video Idea'});
  }
  if(!req.body.details) {
    errors.push({text: 'Please Add Details For Video Idea'});
  }

  if(errors.length > 0) {
    res.render('ideas/add', {
      errors: errors,
      title: req.body.title,
      details: req.body.details
    });
  }  else {

    const newUser = {
      title: req.body.title,
      details: req.body.details
    }
    new Idea(newUser)
      .save()
      .then(idea => {
        res.redirect('/ideas');
      })
  }
});

const port = 5000;
app.listen(port, () => {
  console.log(`Server is running on the port ${port}`);
});
