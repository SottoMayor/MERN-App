const Router = require('express').Router;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const router = Router();

const createToken = () => {
  return jwt.sign({}, 'secret', { expiresIn: '1h' });
};

const getDB = require('../database').getDB;

router.post('/login', (req, res, next) => {
  const email = req.body.email;
  const pw = req.body.password;
  // Check if user login is valid
  // If yes, create token and return it to client
  const token = createToken();
  // res.status(200).json({ token: token, user: { email: 'dummy@dummy.com' } });
  res
    .status(401)
    .json({ message: 'Authentication failed, invalid username or password.' });
});

router.post('/signup', (req, res, next) => {
  const email = req.body.email;
  const pw = req.body.password;

  //Checking if the email already exists
  const db = getDB().db()
  db.collection('users').findOne({email: email})
  .then( user => {

    if(user){
      throw new Error('This email already exists! Pick up another.')
    }

    // Hash password before storing it in database => Encryption at Rest
    bcrypt
    .hash(pw, 12)
    .then(hashedPW => {
      // Store hashedPW in database

      const newUser = {
        email: email,
        password: hashedPW
      }

      db.collection('users').insertOne(newUser)
      .then( insertedUser => {
        const token = createToken();
        res
        .status(201)
        .json({ token: token, user: { email: email } });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({ message: 'Creating the user failed.' });
      });
    })

  })
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: 'Creating the user failed.' });
    });
  // Add user to database
});

module.exports = router;
