import { Router } from "express";
import aiController from "./ai.controller.mjs";
const router = Router();


router.post('/v1/ai/prompt', aiController.chatWithAI);


export { router as aiRoutes };