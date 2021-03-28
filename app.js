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

function generateAccessToken(user, username) {
  // TODO отправить id на клиент
  const id_user = user.rows[0].id;
  return jwt.sign({ id_user , username }, TOKEN_SECRET, { expiresIn: "1h"})
}

// Middlewares
app.use(cors())
app.use(express.urlencoded())
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

  user = await pool.query('SELECT id FROM a_user WHERE username = $1', [username,]);

  const token = generateAccessToken(user, username)

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

const setPreferences = async (id_user, preferences) => {
  const query = {
    text: `INSERT INTO a_preferences (id_user, hide_materials) VALUES ($1, $2) on conflict (id_user) do update set hide_materials = $2`,
    values: [id_user, preferences.hide_materials]
  }
  try {
    await pool.query(query);
  } catch(error) {
    console.log(error);
  }
}

const fetchCurrentPreferences = async (id_user) => {

  const query = {
    text: "SELECT * FROM a_preferences WHERE id_user = $1",
    values: [id_user]
  }
  try {
    const data = await pool.query(query);
    return data.rows[0];
  } catch (error) {
    console.log(error);
  }
}

app.post('/user/:id_user/preferences', async(req, res) => {
  const id_user = req.params.id_user;
  const preferences = req.body;
  
  await setPreferences(id_user, preferences);

  res.send({})
})

app.get('/user/:id_user/preferences', async (req, res) => {
  const id_user = req.params.id_user;
  const response = { data: null, error: null }
  try {
    response.data = await fetchCurrentPreferences(id_user)
  } catch (error) {
  }
  res.send(response)
})

const createMaterial = async (id_user, material) => {
  const query = {
    text: `INSERT INTO a_material (title, preview_image_path, body, created_at, id_user) VALUES
    ($1, $2, $3, $4, $5);`,
    values: [material.title, material.preview_image_path, material.body, material.created_at, id_user]
  }
  try {
    await pool.query(query);
  } catch (error) {
    console.log(error);
  }
}

const fetchMaterials = async (id_user) => {
  //  WHERE id_user = $1
  // values: [id_user]
  const query = {
    text: "SELECT * FROM a_material", 
  }
  try {
    const result = await pool.query(query);
    return await result.rows;
  } catch (error) {
    console.log(error);
  }
}

// Список материалов для пользователя
app.get('/user/:id_user/materials', async (req, res) => {
  const id_user = req.params.id_user;
  let response = {
    data: null, 
    error: null,
  }
  try {
    response.data = await fetchMaterials(id_user);
  } catch (error) {
    console.log(error);
  }
  res.send(response)
});

// Создание нового материал
app.post('/user/:id_user/materials/new', async (req, res) => {
  const id_user = req.params.id_user;
  const material = req.body.material;

  console.log(req.body.material);

  const response = { data: null, error: null };

  try {
    await createMaterial(id_user, material)
    response.data = "200";
  } catch (error) {
    console.log(error);
    response.error = error
  }
  res.send(response)
});


app.listen(PORT, () => {
  console.log(`Server running at: http://localhost:${PORT}`);
});