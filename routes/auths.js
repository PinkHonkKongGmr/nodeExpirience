const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt-nodejs');
const User = require('../models/user');

router.post('/register', (req, res) => {
  const login = req.body.login;
  const password = req.body.password;
  const passwordConfirm = req.body.passwordConfirm;
  const mail = req.body.mail.toLowerCase();
  bcrypt.hash(password, null, null, (err, hash) => {
    User.findOne({
      login
    }).then(user => {
      if (!user) {
        User.create({
          login,
          password: hash,
          mail
        }).then(user => {
          req.session.userID = user.id;
          req.session.userLogin = user.login;
          res.json({
            ok: true
          })
          res.json({
            ok: true
          })
        }).catch(err => {
          console.log(err);
          res.json({
            ok: false,
            error: err
          });
        });
      } else {
        res.json({
          ok: false,
          error: user
        });
      }
    })
  });
});

router.post('/login', (req, res) => {
  const login = req.body.login;
  const password = req.body.password;
  if (!login || !password) {
    var fields = [];
    if (!login) fields.push('login');
    if (!password) fields.push('password');
    res.json({
      ok: false,
      error: "все поля должны быть заполнены",
      fields
    });
  } else {
    User.findOne({
      login
    }).then(user => {
      if (!user) {
        console.log('not find');
        res.json({
          ok: true,
          status: "not found this user"
        })
      } else {
        bcrypt.compare(password, user.password, function(err, result) {
          if (!result) {
            res.json({
              ok: false,
              status: "несовпадения"
            })
          }
          if (result) {
            req.session.userID = user.id;
            req.session.userLogin = user.login;
            res.json({
              ok: true,
              status: user.id
            })
          }
        });
      }
    }).catch(err => {
      console.log(err);
      res.json({
        ok: false,
        error: "ошибочка, знаете ли"
      })
    })
  }
})
router.post('/checkMail', (req, res) => {
  const mail = req.body.val.toLowerCase();
  User.findOne({
    mail
  }).then(user => {
    if (user) {
      res.json({
        pass: false
      })
    } else {
      res.json({
        pass: true
      })
      console.log(mail);
    }
  }).catch(err => {
    console.log(err);
    res.json({
      ok: false,
      error: err
    });
  })
});
router.post('/check', (req, res) => {
  const login = req.body.val;
  User.findOne({
    login
  }).then(user => {
    if (user) {
      res.json({
        pass: false
      })
    } else {
      res.json({
        pass: true
      })
      console.log(login);
    }
  }).catch(err => {
    console.log(err);
    res.json({
      ok: false,
      error: err
    });
  })
});
router.get('/logout', (req, res) => {
  if (req.session) {

    req.session.destroy(() => {
      res.redirect('/');
    });
  } else {
    res.redirect('/');
  }
});

module.exports = router;
