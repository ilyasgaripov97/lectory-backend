const pool = require('../../db/db').pool;


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

class PreferencesService  {
  async static setPrefernce() {

  }
  async static fetchPreferences() {

  }
}

module.exports = PreferencesService;