const pool = require('../../db/db').pool;


class CategoriesService {

    static async createCategory(name) {
        try {
            const query = {
                text: "INSERT INTO a_category(name) VALUEs($1)",
                values: [name, ]
            }
            await pool.query(query)
        } catch (error) {
            console.log(error);
        }
    }

    static async readCategory(id_category, name) {
        try {
            const query = {
                text: 'SELECT * FROM a_category WHERE id = $1 OR name = $2',
                values: [id_category, name,]
            }
            const result = await pool.query(query);
            console.log(result.rows[0]);
            return result.rows[0];
        } catch (error) {
            console.log(error);
        }
    }

    static async updateCategory(id_category, name) {
        try {
            const query = {
                text: "UPDATE a_category SET name = $2 WHERE id = $1",
                values: [id_category, name],
            };
            await pool.query(query);
        } catch (error) {
            console.log(error);
        }
    }

    static async deleteCategory(id_category) {
        try {
            const query = {
                text: "DELETE FROM a_category WHERE id = $1",
                values: [id_category, ] 
            }
            await pool.query(query);
        } catch (error) {
            console.log(error);
        }
    }
}

module.exports = CategoriesService