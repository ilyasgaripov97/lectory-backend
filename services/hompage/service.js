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
    /* Список всех доступных материалов пользователя*/
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
  static async removeMaterial(id_user, id_material) {
    /* Убирает материал из списка материалов пользователя*/
    const query = {
      text: "UPDATE a_material SET id_user = $1 WHERE id = $2 AND id_user = $3",
      values: [null, id_material, id_user],
    }
    try {
      await pool.query(query) 
    }
    catch (error) {
      return Promise.reject(error)
    }
  }
  static async fetchMaterial(id_user, id_material) {
    /* Отдельный материал у пользователя с заданным id */
    const query = {
      text: "SELECT * FROM a_material WHERE id_user = $1 AND id = $2",
      values: [id_user, id_material],
    }
    try {
      const result = await pool.query(query);
      return result.rows[0];
    } catch (error) {
      return Promise.reject(error)
    }
  }
}

module.exports = HomepageService