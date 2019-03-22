const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const staticAsset = require('static-asset');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const config = require('./config');
const routes = require('./routes');
const Cars = require('./models/cars');


// dataBase block start
mongoose.Promise = global.Promise;
mongoose.set('debug', config.IS_PRODUCTION);
mongoose.connection
  .on('error', error => console.log(error))
  .on('close', () => console.log('Database connection closed.'))
  .once('open', () => {
    const info = mongoose.connections[0];
    console.log(`Connected to ${info.host}:${info.port}/${info.name}`);
  });
mongoose.connect(config.MONGO_URL, {
  useNewUrlParser: true
});
// dataBase block over

// express
const app = express();
app.use(
  session({
    secret: config.SESSION_SECRET,
    resave: true,
    saveUninitialized: false,
    store: new MongoStore({
      mongooseConnection: mongoose.connection
    })
  })
);
// sets
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.use(staticAsset(path.join(__dirname, 'dist')));
app.use(express.static(path.join(__dirname, 'dist')));

// routes
app.get('/', (req, res) => {
  const id = req.session.userId;
  const login = req.session.userLogin;
  Cars.find({}).then(cars => {
    res.render('index', {
      cars: cars,
      user: {
        id,
        login
      }
    })
  })
})
app.get('/create', (req, res) => {
  const id = req.session.userId;
  const login = req.session.userLogin;
  res.render('create', {
    user: {
      id,
      login
    }
  })
})
app.get('/autorization', (req, res) => {
  const id = req.session.userId;
  const login = req.session.userLogin;
  res.render('autorization', {
    user: {
      id,
      login
    }
  })
})

app.use('/api/auths', routes.auths);



// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.render('error', {
    message: error.message,
    error: !config.IS_PRODUCTION ? error : {}
  });
});


app.listen(config.PORT, () =>
  console.log(`Example app listening on port ${config.PORT}!`)
);
