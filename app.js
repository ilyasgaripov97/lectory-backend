const express = require('express');
const app = express();
const cors = require('cors');
const jwt = require('jsonwebtoken')

/* DB and BCRYPT */

const pool = require('./db/db').pool;
const bcrypt = require('bcrypt');
const saltRounds = 10;

const storeUser = (username, passwordHash) => {
  // Формируем данные для запроса к базе
  const query = {
    text: "INSERT INTO a_user(username, password_hash) VALUES ($1, $2)",
    values: [username , passwordHash]
  }

  // Добавляем пользователя в базу, @TODO добавить уникальный индекс
  // для того чтобы не было двух одинаковых пользователей
  pool
    .query(query, (err, res) => {
      if (err) {
        console.log(err.stack);
      } else {
        console.log(res.rows[0])
      }
    })  
}

// function checkUser(username, password) {
//   const query = {
//     text: "SELECT password_hash FROM a_user WHERE username = $1",
//     values: [username]
//   }
//   pool.query(query, (err, res) => {
//     if (err) {
//       console.log(err);
//     }
//     console.log(res.fields);
//     console.log(res.rows)
//     bcrypt.compare(password, res.rows[0].password_hash, (err, result) => {
//       if (err) {
//         console.log(err);
//       }
//       console.log(result);
//     })
//   })
// }

/* ENDOF DB and BCRYPT */

// const authRoutes = require('./routes/auth/router');

const PORT = 8000;
const TOKEN_SECRET = 'e4193e393dd4735fa17c18de1c5069b82ec7593541f53cb4e08122d95a8d6f68dc607c54dc44834b78a5a1057fca384c1837a8c392e4c1a'

function generateAccessToken(username) {
  return jwt.sign({ username }, TOKEN_SECRET, { expiresIn: "1h"})
}

function authenticateToken(req, res, next) {
  // Gather the jwt access token from the request header
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  console.log(token);
  if (token == null) return res.sendStatus(401) // if there isn't any token

  jwt.verify(token, TOKEN_SECRET, (err, user) => {
    console.log(err)

    if (err) return res.sendStatus(403)
    req.user = user
    next() // pass the execution off to whatever request the client intended
  })
}

// Middlewares
app.use(cors())
app.use(express.json())
// app.use(authRoutes)

// Routes

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  let response = {token: null};
  if (username === 'admin' && password === 'admin') {
    response = {token: 'sometoken'}
  }
  res.send(response)
})


app.listen(PORT, () => {
  console.log(`Server running at: http://localhost:${PORT}`);
});