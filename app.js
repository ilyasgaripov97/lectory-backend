const express = require('express');
const app = express();
const cors = require('cors');

// temporary
const pool = require('./db/db').pool;

const authRoutes = require('./api/auth/routes');
const homepageRoutes = require('./api/homepage/routes')

const PORT = 8000;
const TOKEN_SECRET = 'e4193e393dd4735fa17c18de1c5069b82ec7593541f53cb4e08122d95a8d6f68dc607c54dc44834b78a5a1057fca384c1837a8c392e4c1a'


// Middlewares
app.use(cors())
app.use(express.urlencoded())
app.use(express.json())
app.use(authRoutes)
app.use(homepageRoutes)

// Routes

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

// Список материалов для пользователя
// app.get('/user/:id_user/materials', async (req, res) => {
//   const id_user = req.params.id_user;
//   let response = {
//     data: null, 
//     error: null,
//   }
//   try {
//     response.data = await fetchMaterials(id_user);
//   } catch (error) {
//     console.log(error);
//   }
//   res.send(response)
// });

// Создание нового материал


app.listen(PORT, () => {
  console.log(`Server running at: http://localhost:${PORT}`);
});