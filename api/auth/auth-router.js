const router = require('express').Router();
const bcrypt = require('bcryptjs')
const users = require('../users/model')
const tokenBuilder = require('../tokenBuilder');

const vdUsername = (req, res, next) => {
  const { username } = req.body;
  users.findBy({ username })
    .then(([user]) => {
      if (user) {
        next({
          status: 401,
          message: "username taken"
        })
      } else {
        next();
      }
    })
}

const vdUser = (req, res, next) => {
  const { username, password } = req.body;
  if (!username || !username.trim()
    || !password || !password.trim()
  ) {
    next({
      status: 401,
      message: "username and password required"
    })
  } else {
    next();
  }
}

const vdUsernameExists = (req, res, next) => {
  const { username } = req.body;
  users.findBy({ username })
    .then(([user]) => {
      if (!user) {
        next({
          status: 401,
          message: "invalid credentials"
        })
      } else {
        req.user = user;
        next();
      }
    })
}

router.post('/register', vdUser, vdUsername, (req, res, next) => {
  const { username, password } = req.body;
  const hash = bcrypt.hashSync(password, 8);

  users.addUser({ username, password: hash })
    .then(newUser => {
      res.status(201).json(newUser);
    })
    .catch(next);
});

router.post('/login',vdUser,vdUsernameExists, (req, res,next) => {
  res.end('implement login, please!');
 
      if (bcrypt.compareSync(req.body.password, req.user.password)){
        const token = tokenBuilder(req.user)
        res.status(200).json({
          message: `welcome, ${req.user.username}`,
          token,
        })
      }else{
        next({
      status: 401,
      message: "invalid credentials"
    })
  }
});

module.exports = router;
