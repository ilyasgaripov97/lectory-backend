const express = require('express');
const app = express();
const cors = require('cors');
const jwt = require('jsonwebtoken')

/* DB and BCRYPT */

const pool = require('./db/db').pool;
const bcrypt = require('bcrypt');
const saltRounds = 10;


const storeUser = async (username, passwordHash) => {
  try {
    query = {
      text: "INSERT INTO a_user(username, password_hash) VALUES ($1, $2)",
      values: [username , passwordHash]
    }
    await pool.query(query);
  } catch (error) {
    console.log(error);
  }
}

const checkUser = async (username, password) => {
  let user = {};
  try {
    const query = {
      text: "SELECT password_hash FROM a_user WHERE username = $1",
      values: [username]
    }
    user = await pool.query(query);
    if (user.rowCount === 0) return Promise.reject('Such user does not exist.') 
    try {
      
      const result = await bcrypt.compare(password, user.rows[0].password_hash);
      return result;
    } catch(bcryptError) {
      console.log('Bcrypt compare error: ' + bcryptError);
    }
    console.log(user);
  } catch (queryError) {
    console.log('Query error: ' + queryError);
  }


}


/* ENDOF DB and BCRYPT */

// const authRoutes = require('./routes/auth/router');

const PORT = 8000;
const TOKEN_SECRET = 'e4193e393dd4735fa17c18de1c5069b82ec7593541f53cb4e08122d95a8d6f68dc607c54dc44834b78a5a1057fca384c1837a8c392e4c1a'

function generateAccessToken(username) {
  return jwt.sign({ username }, TOKEN_SECRET, { expiresIn: "1h"})
}

// Middlewares
app.use(cors())
app.use(express.json())
// app.use(authRoutes)

// Routes
app.post('/signup', async (req, res) => {
  const { username, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    console.log(hashedPassword);
    await storeUser(username, hashedPassword)
  } catch(error) {
    console.log(error);
  }

  res.send({})
})

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const token = generateAccessToken(username)

  let response = {};

  try {
    const userHasValidCredentials = await checkUser(username, password);
    if (userHasValidCredentials) {
      response = {token,}
    }
    res.send(response)
  } catch(error) {
    console.log('Credentials are incorrect: ' + error);
    res.send({error})
  }


})


app.listen(PORT, () => {
  console.log(`Server running at: http://localhost:${PORT}`);
});