require('dotenv').config();

const express = require('express')
const router = express.Router();
const genAI = require('@google/generative-ai');
const genAIClient = new genAI.GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAIClient.getGenerativeModel({ model: "gemini-1.5-flash" });

//chatbot api
router.post('/', async (req, res) => {
    try {
        const { message } = req.body;
        //프롬포트 입력 설정하기 + 
        const result = await model.generateContent(message)
        let reply = result.response.text()
        reply = reply.replace(/\*\*/g, '')

        res.json({ reply })
    } catch (err) {
        console.error('gemini api error: ', err)
        res.status(500).json({ error: 'Gemini api 호출 중 오류 발생' })
    }
})
module.exports = router;