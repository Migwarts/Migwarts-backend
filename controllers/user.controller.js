exports.createUser = async (req, res) => {
  const pool = req.app.get("db");
  let conn;

  try {
    conn = await pool.getConnection();
    const { number, name } = req.body;

    if (!number || !name) {
      return res.status(400).json({ message: "학번과 이름을 입력하세요." });
    }

    const result = await conn.query(
      "INSERT INTO users (number, name) VALUES (?, ?)",
      [number, name]
    );
    const insertId = result[0]?.insertId;

    res.status(201).json({ message: "학생 저장 성공!", id: insertId });
  } catch (error) {
    console.error("❌ 학생 저장 실패:", error);
    res.status(500).json({ message: "서버 오류 발생", error: error.message });
  } finally {
    if (conn) conn.release();
  }
};

exports.deleteUser = async (req, res) => {
  const pool = req.app.get("db");
  const id = req.params.id;
  let conn;

  try {
    conn = await pool.getConnection();
    const [result] = await conn.query("DELETE FROM users WHERE id = ?", [id]);

    res.status(200).json({
      message: "사용자 삭제 완료",
      affectedRows: result.affectedRows,
    });
  } catch (error) {
    console.error("❌ 사용자 삭제 실패:", error);
    res.status(500).json({ message: "서버 오류 발생", error: error.message });
  } finally {
    if (conn) conn.release();
  }
};

exports.updateUser = async (req, res) => {
  const pool = req.app.get("db");
  const id = req.params.id;
  const { name } = req.body;
  let conn;

  try {
    conn = await pool.getConnection();
    await conn.query("UPDATE users SET name = ? WHERE id = ?", [name, id]);
    res.status(200).json({ message: "사용자 이름 수정 완료" });
  } catch (error) {
    console.error("❌ 사용자 업데이트 실패:", error);
    res.status(500).json({ message: "서버 오류 발생", error: error.message });
  } finally {
    if (conn) conn.release();
  }
};
