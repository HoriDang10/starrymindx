import { Router, Request, Response } from "express";

const router = Router();

/** 
 * Danh sách quiz được hỗ trợ 
 * (Có thể mở rộng thêm Eternity Gate, Starry Night, Bedroom...)
 */
const supportedQuizzes = ["wheatfield", "bedroom", "eternity-gate", "starry-night"];

/**
 * POST /routes/quiz/:quizId
 * Nhận câu trả lời quiz (dạng động)
 */
router.post("/:quizId", (req: Request, res: Response) => {
  const { quizId } = req.params;
  const { answers } = req.body ?? {};

  if (!supportedQuizzes.includes(quizId)) {
    return res.status(404).json({ error: `Quiz '${quizId}' chưa được hỗ trợ.` });
  }
  if (!answers || typeof answers !== "object") {
    return res.status(400).json({ error: "Thiếu hoặc sai định dạng 'answers'." });
  }

  console.log(`📥 Quiz '${quizId}' answers:`, answers);

  // Tóm tắt nhẹ cho debug
  const picked = Object.values(answers);
  const summary = {
    total: picked.length,
    first: picked[0] ?? null,
    last: picked[picked.length - 1] ?? null,
  };

  return res.json({
    message: `✅ Quiz '${quizId}' received.`,
    quizId,
    answers,
    summary,
  });
});

export default router;
