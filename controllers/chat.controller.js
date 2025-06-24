const ChatModel = require("../Model/ChatModel");

// ✅ [GET] 기숙사별 채팅 + 유저 정보 불러오기
exports.getDormChat = async (req, res) => {
  const dormitory = req.params.dormitory;
  const pool = req.pool;

  try {
    const parsedRows = await ChatModel.getDormChat(pool, dormitory);
    res.status(200).json({
      message: "채팅 + 유저 정보 불러오기 성공!",
      data: parsedRows,
    });
  } catch (error) {
    console.error("❌ 채팅 데이터 불러오기 실패:", error);
    res.status(500).json({ message: "서버 오류 발생", error: error.message });
  }
};

// ✅ [POST] 새 채팅 저장 (기존 있으면 추가, 없으면 새로 만들기)
exports.postChat = async (req, res) => {
  const id = req.params.id;
  const { dormitory, newChat } = req.body;
  const pool = req.pool;

  if (!id || !dormitory || !newChat) {
    return res.status(400).json({ message: "모든 항목을 입력해주세요." });
  }

  try {
    const rows = await ChatModel.getChatByUserId(pool, id);

    if (rows.length > 0) {
      let chatArray =
        typeof rows[0].chat === "string"
          ? JSON.parse(rows[0].chat)
          : rows[0].chat;

      chatArray.push(newChat);
      await ChatModel.updateChatByUserId(pool, id, chatArray);
    } else {
      await ChatModel.insertChat(pool, {
        id,
        dormitory,
        chatArray: [newChat],
      });
    }

    res.status(201).json({ message: "채팅 저장 완료!" });
  } catch (error) {
    console.error("❌ 채팅 저장 실패:", error);
    res.status(500).json({ message: "서버 오류 발생", error: error.message });
  }
};
