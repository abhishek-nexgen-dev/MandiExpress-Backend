import { Router } from "express";
import aiService from "./ai.service.mjs";
const router = Router();


router.post('/v1/ai/prompt', async (req, res) => {
    try {
        const aiData = req.body;
        const response = await aiService.chatWithAI(aiData);
        res.status(200).json({
            message: "AI response generated successfully",
            data: response,
            success: true,
        });
    } catch (error) {
        res.status(500).json({
            message: error.message || "AI content generation failed",
            error: true,
        });
    }
});


export { router as aiRoutes };