const pool = require('./db').pool;


const createUserTable = async () => {
  try {
    await pool.query('DROP TABLE IF EXISTS a_user CASCADE;');
    await pool.query(`CREATE TABLE a_user(
      id serial PRIMARY KEY,
      username VARCHAR(50) UNIQUE NOT NULL,
      password_hash VARCHAR(256)
    );`);
  } catch (error) {
    console.log(error);
  }
}

const createMaterialTable = async() => {
  try {
    await pool.query('DROP TABLE IF EXISTS a_material CASCADE;');
    await pool.query(`CREATE TABLE a_material(
      id serial PRIMARY KEY,
      title VARCHAR(500),
      preview_image_path VARCHAR(1024),
      body text,
      created_at DATE,
      id_user int,
      CONSTRAINT fk_user FOREIGN KEY (id_user) REFERENCES a_user(id)
    );`);
  } catch(error) {
    console.log(error);
  }
}

const createTables = () => {
  createUserTable();
  createMaterialTable()
}

const initialize = () => {
  createTables()
}

initialize();