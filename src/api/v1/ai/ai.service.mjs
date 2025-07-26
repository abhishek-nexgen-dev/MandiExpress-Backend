import { GoogleGenAI } from "@google/genai";
import fs from "fs";
import path from "path";
import User_Controller from "../user/user.controller.mjs";
import envConstant from "../../../constant/env.constant.mjs";

const ai = new GoogleGenAI({
    apiKey: envConstant.GEMINI_API_KEY,
});

class Ai_Service {
    async chatWithAI(aiData) {
        try {
            // Resolve the path to the AI prompt file
            const promptPath = path.resolve("src/api/v1/ai/ai.prompt.text");
            const prompt = fs.readFileSync(promptPath, "utf8");

            // Fetch user data using User_Controller
            // const user = await User_Controller.getUserById(aiData.userId);
            // if (!user) {
            //     throw new Error("User not found");
            // }

            let user = {
                name: "John Doe",
                // id: aiData.userId || "12345",
            };

            // Generate content using Google GenAI
            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: prompt,
                config: {
                    systemInstruction: `You are assisting ${user.name}.`,
                },
            });

            console.log(response.text);
            return response.text;
        } catch (error) {
            // Handle any errors that occur during the process
            throw new Error(error.message || "AI content generation failed");
        }
    }
}

export default new Ai_Service();