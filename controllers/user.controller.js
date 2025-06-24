// ✅ [POST] 새로운 학생 등록
exports.createUser = async (req, res) => {
  const pool = req.app.get("db"); // 서버(app)에 등록해둔 DB 커넥션 풀 불러옴
  let conn;

  try {
    conn = await pool.getConnection(); // 커넥션 하나 빌림
    const { number, name } = req.body; // 요청 body에서 학번, 이름 추출

    // ❗ 빈 값 검사
    if (!number || !name) {
      return res.status(400).json({ message: "학번과 이름을 입력하세요." });
    }

    // 💾 DB에 새 학생 정보 INSERT
    const result = await conn.query(
      "INSERT INTO users (number, name) VALUES (?, ?)",
      [number, name]
    );
    const insertId = result[0]?.insertId; // 삽입된 학생의 id 반환용

    // 🎉 응답 보내기
    res.status(201).json({ message: "학생 저장 성공!", id: insertId });
  } catch (error) {
    console.error("❌ 학생 저장 실패:", error);
    res.status(500).json({ message: "서버 오류 발생", error: error.message });
  } finally {
    if (conn) conn.release(); // 커넥션 반납!
  }
};

// ✅ [DELETE] 학생 삭제
exports.deleteUser = async (req, res) => {
  const pool = req.app.get("db");
  const id = req.params.id; // URL에서 id 꺼냄
  let conn;

  try {
    conn = await pool.getConnection();

    // 🗑️ 해당 id의 학생 삭제
    const [result] = await conn.query("DELETE FROM users WHERE id = ?", [id]);

    res.status(200).json({
      message: "사용자 삭제 완료",
      affectedRows: result.affectedRows, // 실제 삭제된 row 수 (0이면 없는 id!)
    });
  } catch (error) {
    console.error("❌ 사용자 삭제 실패:", error);
    res.status(500).json({ message: "서버 오류 발생", error: error.message });
  } finally {
    if (conn) conn.release();
  }
};

// ✅ [PUT or PATCH] 학생 이름 수정
exports.updateUser = async (req, res) => {
  const pool = req.app.get("db");
  const id = req.params.id; // URL에서 수정할 id
  const { name } = req.body; // 새 이름
  let conn;

  try {
    conn = await pool.getConnection();

    // ✏️ 이름 수정 쿼리 실행
    await conn.query("UPDATE users SET name = ? WHERE id = ?", [name, id]);

    res.status(200).json({ message: "사용자 이름 수정 완료" });
  } catch (error) {
    console.error("❌ 사용자 업데이트 실패:", error);
    res.status(500).json({ message: "서버 오류 발생", error: error.message });
  } finally {
    if (conn) conn.release();
  }
};