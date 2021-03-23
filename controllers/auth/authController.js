const pool = require('../db/db').pool;
const bcrypt = require('bcrypt');
const saltRounds = 10;


module.exports.signupGET = (req, res) => {
  res.json({response: 'Signup GET'})
}

module.exports.loginGET = (req, res) => {
  res.json({response: 'Login GET'})
}

/*
  Создает запись о пользователе в базе данных
*/
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

module.exports.signupPOST = (req, res) => {
  // Получаем данные о пользователе
  const { username, password } = req.body;

  bcrypt.hash(password, saltRounds, (err, hash) => {
    if (err) {
      console.log(err);
    }
    storeUser(username, hash);
  })
   
  // Если успешно отсылаем токен
  res.json({response: '(new user) Signup POST', data: "user created"})
}

function checkUser(username, password) {
  const query = {
    text: "SELECT password_hash FROM a_user WHERE username = $1",
    values: [username]
  }
  pool.query(query, (err, res) => {
    if (err) {
      console.log(err);
    }
    console.log(res.fields);
    console.log(res.rows)
    bcrypt.compare(password, res.rows[0].password_hash, (err, result) => {
      if (err) {
        console.log(err);
      }
      console.log(result);
    })
  })
}

module.exports.loginPOST = (req, res) => {
  const { username, password } = req.body;
  // checkUser(username, password);

  checkUser(username, password);
  // bcrypt.compare(password, )

  res.json({response: '(user login) Login POST'})
}
