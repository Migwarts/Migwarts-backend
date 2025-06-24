// ✅ [GET] 기숙사별 채팅 + 유저 정보 불러오기
exports.getDormChat = async (req, res) => {
  const dormitory = req.params.dormitory; // URL 파라미터에서 기숙사 이름 꺼내기
  let conn;

  try {
    conn = await req.pool.getConnection(); // DB 연결에서 커넥션 하나 빌리기

    // users 테이블과 chat 테이블을 조인해서
    // 해당 기숙사(dormitory)의 유저 정보랑 채팅 내용 같이 가져오기
    const [rows] = await conn.query(
      `SELECT users.id, users.number, users.name, chat.chat
       FROM users
       JOIN chat ON users.id = chat.id
       WHERE chat.dormitory = ?`,
      [dormitory]
    );   

    // chat 컬럼은 JSON 데이터인데, DB에선 문자열로 저장되어 있을 수 있으니까
    // 만약 문자열이면 JSON.parse()로 다시 객체(배열)로 변환해줌
    const parsedRows = rows.map(row => ({
      ...row,
      chat: typeof row.chat === "string" ? JSON.parse(row.chat) : row.chat,
    }));

    // 성공적으로 데이터 불러왔으면 JSON 형태로 응답하기
    res.status(200).json({
      message: "채팅 + 유저 정보 불러오기 성공!",
      data: parsedRows,
    });
  } catch (error) {
    // 에러가 나면 에러 로그 찍고 클라이언트에 500 에러 전송
    console.error("❌ 채팅 데이터 불러오기 실패:", error);
    res.status(500).json({ message: "서버 오류 발생", error: error.message });
  } finally {
    // 연결해준 커넥션은 반드시 반납해줘야 함(커넥션 풀 관리)
    if (conn) conn.release();
  }
};

// ✅ [POST] 새 채팅 저장 (기존 있으면 추가, 없으면 새로 만들기)
exports.postChat = async (req, res) => {
  const id = req.params.id; // URL 파라미터로 들어온 유저 ID
  const { dormitory, newChat } = req.body; // 요청 본문에서 기숙사 이름과 새 메시지 추출
  let conn;

  try {
    // 필수 값들 중 하나라도 없으면 400 에러(잘못된 요청) 응답
    if (!id || !dormitory || !newChat) {
      return res.status(400).json({ message: "모든 항목을 입력해주세요." });
    }

    conn = await req.pool.getConnection(); // DB 커넥션 빌리기

    // 해당 유저(id)의 기존 채팅 기록이 있는지 조회
    const [rows] = await conn.query("SELECT chat FROM chat WHERE id = ?", [id]);

    let chatArray = [];

    if (rows.length > 0) {
      // 기존 채팅 기록이 있으면 문자열인지 확인 후 JSON.parse로 객체(배열)로 변환
      chatArray =
        typeof rows[0].chat === "string"
          ? JSON.parse(rows[0].chat)
          : rows[0].chat;

      chatArray.push(newChat); // 새 채팅 메시지 배열에 추가

      // 업데이트 쿼리 실행 (배열을 다시 JSON 문자열로 변환해서 저장)
      await conn.query("UPDATE chat SET chat = ? WHERE id = ?", [
        JSON.stringify(chatArray),
        id,
      ]);
    } else {
      // 기존 기록이 없으면 새 레코드 INSERT
      // 새 채팅 메시지를 배열로 만들고 JSON 문자열로 변환해서 저장
      await conn.query(
        "INSERT INTO chat (id, dormitory, chat) VALUES (?, ?, ?)",
        [id, dormitory, JSON.stringify([newChat])]
      );
    }

    // 저장 완료되면 성공 응답 보내기
    res.status(201).json({ message: "채팅 저장 완료!" });
  } catch (error) {
    // 에러가 나면 콘솔에 로그 찍고 500 서버 에러 응답
    console.error("❌ 채팅 저장 실패:", error);
    res.status(500).json({ message: "서버 오류 발생", error: error.message });
  } finally {
    // 빌린 커넥션은 꼭 반납!
    if (conn) conn.release();
  }
};