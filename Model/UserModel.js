const UserModel = {
    async findById(pool, id) {
        const conn = await pool.getConnection();
        try {
            const [rows] = await conn.query("SELECT * FROM users WHERE id = ?", [id]);
            return rows[0];
        } finally {
            conn.release();
        }
    },

    async createUser(pool, { number, name }) {
        const conn = await pool.getConnection();
        try {
            const [result] = await conn.query(
                "INSERT INTO users (number, name) VALUES (?, ?)",
                [number, name]
            );
            return result.insertId;
        } finally {
            conn.release();
        }
    },

    async updateUserName(pool, id, name) {
        const conn = await pool.getConnection();
        try {
            await conn.query("UPDATE users SET name = ? WHERE id = ?", [name, id]);
        } finally {
            conn.release();
        }
    },

    async deleteUser(pool, id) {
        const conn = await pool.getConnection();
        try {
            const [result] = await conn.query("DELETE FROM users WHERE id = ?", [id]);
            return result.affectedRows;
        } finally {
            conn.release();
        }
    },
};

module.exports = UserModel;
