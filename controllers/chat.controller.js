exports.getDormChat = async (req, res) => {
  const dormitory = req.params.dormitory;
  let conn;

  try {
    conn = await req.pool.getConnection();
    const [rows] = await conn.query(
      `SELECT users.id, users.number, users.name, chat.chat
       FROM users
       JOIN chat ON users.id = chat.id
       WHERE chat.dormitory = ?`,
      [dormitory]
    );

    const parsedRows = rows.map((row) => ({
      ...row,
      chat: typeof row.chat === "string" ? JSON.parse(row.chat) : row.chat,
    }));

    res.status(200).json({
      message: "채팅 + 유저 정보 불러오기 성공!",
      data: parsedRows,
    });
  } catch (error) {
    console.error("❌ 채팅 데이터 불러오기 실패:", error);
    res.status(500).json({ message: "서버 오류 발생", error: error.message });
  } finally {
    if (conn) conn.release();
  }
};

exports.postChat = async (req, res) => {
  const id = req.params.id;
  const { dormitory, newChat } = req.body;
  let conn;

  try {
    if (!id || !dormitory || !newChat) {
      return res.status(400).json({ message: "모든 항목을 입력해주세요." });
    }

    conn = await req.pool.getConnection();
    const [rows] = await conn.query("SELECT chat FROM chat WHERE id = ?", [id]);

    let chatArray = [];
    if (rows.length > 0) {
      chatArray =
        typeof rows[0].chat === "string"
          ? JSON.parse(rows[0].chat)
          : rows[0].chat;
      chatArray.push(newChat);

      await conn.query("UPDATE chat SET chat = ? WHERE id = ?", [
        JSON.stringify(chatArray),
        id,
      ]);
    } else {
      await conn.query(
        "INSERT INTO chat (id, dormitory, chat) VALUES (?, ?, ?)",
        [id, dormitory, JSON.stringify([newChat])]
      );
    }

    res.status(201).json({ message: "채팅 저장 완료!" });
  } catch (error) {
    console.error("❌ 채팅 저장 실패:", error);
    res.status(500).json({ message: "서버 오류 발생", error: error.message });
  } finally {
    if (conn) conn.release();
  }
};
