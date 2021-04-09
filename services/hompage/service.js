const pool = require('../../db/db').pool;


class HomepageService {
  static async createMaterial(id_user, material) {
    /* Создание нового материала для пользователя */
    const query = {
      text: `INSERT INTO a_material (title, preview_image_path, body, created_at, id_user) VALUES
      ($1, $2, $3, $4, $5);`,
      values: [material.title, material.previewImagePath, material.body, material.created_at, id_user]
    }
    try {
      await pool.query(query);
    } catch (error) {
      // TODO logs
      return Promise.reject(error)
    }
  }
  static async fetchMaterials(id_user) {
    /* Список всех доступных материалов */
    // TODO сделать сортировку по дате
    const query = {
      text: "SELECT * FROM a_material WHERE id_user = $1 ORDER BY id DESC;",
      values: [id_user,]
    }
    try {
      const result = await pool.query(query);
      return result.rows;
    } catch (error) {
      // TODO logs
      return Promise.reject(error)
    }
  }
}

module.exports = HomepageService