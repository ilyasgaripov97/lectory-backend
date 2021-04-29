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


const addConstraint = async (childTable, constraintName, fkColumns, parentTable, parentColumns) => {
  const sql = `
    ALTER TABLE ${childTable}
    ADD CONSTRAINT ${constraintName}
    FOREIGN KEY (${fkColumns.join(',')})
    REFERENCES ${parentTable} (${parentColumns.join(',')});
  `;
  try {
    await pool.query(`ALTER TABLE ${childTable} DROP CONSTRAINT IF EXISTS ${constraintName}`)
    await pool.query(sql)
  } catch (error) {
    console.log(error);
  }
}
// TODO make created_at to be 
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
      id_category int
    );`);
  } catch(error) {
    console.log(error);
  }
}

const createCategoryTable = async() => {
  try {
    await pool.query('DROP TABLE IF EXISTS a_category CASCADE;');
    await pool.query(`CREATE TABLE a_category(
      id serial PRIMARY KEY,
      name VARCHAR(100)
    );`);
  }
  catch (error) {
    console.log(error)
  }
}

const createTables = async () => {
  try {
    await createUserTable();
    await createMaterialTable();
    await createCategoryTable();
    await addConstraint('a_material', 'fk_category', ['id_category'], 'a_category', ['id']);
  } catch (error) {
    console.log(error);
  }
}


const initialize = () => {
  createTables();
}

initialize();