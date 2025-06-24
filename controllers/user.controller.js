const UserModel = require("../Model/UserModel");

exports.createUser = async (req, res) => {
  const { number, name } = req.body;
  if (!number || !name) {
    return res.status(400).json({ message: "학번과 이름을 입력하세요." });
  }

  try {
    const pool = req.pool;
    const id = await UserModel.createUser(pool, { number, name });
    res.status(201).json({ message: "학생 저장 성공!", id });
  } catch (err) {
    console.error("❌ 학생 저장 실패:", err);
    res.status(500).json({ message: "서버 오류 발생", error: err.message });
  }
};

exports.updateUser = async (req, res) => {
  const { name } = req.body;
  const id = req.params.id;
  if (!name) return res.status(400).json({ message: "이름을 입력하세요." });

  try {
    const pool = req.pool;
    await UserModel.updateUserName(pool, id, name);
    res.status(200).json({ message: "사용자 이름 수정 완료" });
  } catch (err) {
    console.error("❌ 사용자 업데이트 실패:", err);
    res.status(500).json({ message: "서버 오류 발생", error: err.message });
  }
};

exports.deleteUser = async (req, res) => {
  const id = req.params.id;

  try {
    const pool = req.pool;
    const affectedRows = await UserModel.deleteUser(pool, id);

    if (affectedRows === 0) {
      return res.status(404).json({ message: "존재하지 않는 사용자입니다." });
    }

    res.status(200).json({ message: "사용자 삭제 완료" });
  } catch (err) {
    console.error("❌ 사용자 삭제 실패:", err);
    res.status(500).json({ message: "서버 오류 발생", error: err.message });
  }
};