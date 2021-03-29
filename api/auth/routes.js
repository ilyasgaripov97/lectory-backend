const express = require('express')
const router = express.Router();

const AuthService = require('../../services/auth/service');


router.post('/signup', async (req, res) => {
  const { username, password } = req.body;

  try {
    await AuthService.signup({ username, password })
  } catch(error) {
    console.log(error);
    // TODO logs
  }

  res.send({})
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const response = {}

  try {
    await AuthService.generateToken(username);
    const userHasValidCredentials = await AuthService.login(username, password);
    if (userHasValidCredentials) {
      response.token = await AuthService.generateToken(username);
    }
    res.send(response)
  } catch (error) {
    res.send(error)
    // TODO logs
  }
})

module.exports = router;