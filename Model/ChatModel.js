const ChatModel = {
    async getDormChat(pool, dormitory) {
        const conn = await pool.getConnection();
        try {
            const [rows] = await conn.query(
                `SELECT users.id, users.number, users.name, chat.chat
           FROM users
           JOIN chat ON users.id = chat.id
           WHERE chat.dormitory = ?`,
                [dormitory]
            );
            return rows.map(row => ({
                ...row,
                chat: typeof row.chat === "string" ? JSON.parse(row.chat) : row.chat,
            }));
        } finally {
            conn.release();
        }
    },

    async getChatByUserId(pool, id) {
        const conn = await pool.getConnection();
        try {
            const [rows] = await conn.query("SELECT chat FROM chat WHERE id = ?", [id]);
            return rows;
        } finally {
            conn.release();
        }
    },

    async updateChatByUserId(pool, id, chatArray) {
        const conn = await pool.getConnection();
        try {
            await conn.query(
                "UPDATE chat SET chat = ? WHERE id = ?",
                [JSON.stringify(chatArray), id]
            );
        } finally {
            conn.release();
        }
    },

    async insertChat(pool, { id, dormitory, chatArray }) {
        const conn = await pool.getConnection();
        try {
            await conn.query(
                "INSERT INTO chat (id, dormitory, chat) VALUES (?, ?, ?)",
                [id, dormitory, JSON.stringify(chatArray)]
            );
        } finally {
            conn.release();
        }
    },
};

module.exports = ChatModel;
