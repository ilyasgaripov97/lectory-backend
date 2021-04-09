const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const config = require('../../config/config');
const pool = require('../../db/db').pool;


const checkPassword = async (password, passwordHash) => {
  try {
    const isValidPassword = await bcrypt.compare(password, passwordHash)
    return isValidPassword;
  } catch (error) {
    // TODO Добавить логи в файл/базу
    return Promise.reject('The comparison of password and passwordHash failed.')
  }
} 


class AuthService {
  /* Сервис отвечающий за регистрацию и авторизацию пользователей*/

  static async signup(user) {
    /* Регистрация пользователя, создание записи в базе */
    const { username, password } = user;
    const passwordHash = await bcrypt.hash(password, config.SALT_ROUNDS)
    try {
      const query = {
        text: "INSERT INTO a_user(username, password_hash) VALUES ($1, $2)",
        values: [username , passwordHash]
      };
      await pool.query(query)
    }
    catch (error) {
      console.log(error);
      // TODO Добавить логи в файл/базу
      return Promise.reject('Cannot register user.')
    }
  }
  static async login(username, password) {
    /* Авторизация пользователя */
    let user = {};
    try {
      const query = {
        text: "SELECT password_hash FROM a_user WHERE username = $1",
        values: [username]
      }
      user = await pool.query(query);
      if (user.rowCount === 0) return Promise.reject('Such user does not exist.') 
      // Если пользователь существует и ввёл верный пароль
      return await checkPassword(password, user.rows[0].password_hash)
    } catch (error) {
      // TODO Добавить логи в файл/базу
      return Promise.reject('User credentials are not valid.')
    }
  } 
  static async generateToken(username) {
    console.log('username: ' + username);
    try {
      const result = await pool.query('SELECT id FROM a_user WHERE username = $1', [username,])
      const id_user = result.rows[0].id;
      return jwt.sign({ id_user , username }, config.TOKEN_SECRET, { expiresIn: "1h"})
    } catch (error) {
      console.log(error);
    }
  }
    

}


console.log();

module.exports = AuthService
