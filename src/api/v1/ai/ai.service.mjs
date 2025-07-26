// File: src/api/v1/ai/ai.service.mjs

import { GoogleGenerativeAI } from "@google/generative-ai";
import userService from "../user/user.service.mjs";
import envConstant from "../../../constant/env.constant.mjs";
import tools from "./ai.tool.mjs";

const genAI = new GoogleGenerativeAI(envConstant.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash-latest",
  tools: tools,
  

});

class Ai_Service {
  async chatWithAI(aiData) {
    try {
      const chat = model.startChat({
        history: [],
      });

      const userMessage = aiData.message || "Find suppliers near me";


      const result = await chat.sendMessage(userMessage);
      const response = result.response;


      const functionCall = response.functionCalls()?.[0];

      if (functionCall) {
        const { name, args } = functionCall;
        console.log(`🤖 AI wants to call the tool: ${name}(${JSON.stringify(args)})`);

        if (name === "findSupplierNearLocation") {
          const locationName = args.location?.trim();


          if (!locationName || (locationName.split(" ").length === 1 && !locationName.includes(","))) {
            const clarificationMessage = `The location "${locationName}" is too vague. Please include the state or country (e.g., "Chatra, Jharkhand, India").`;
            await chat.sendMessage(clarificationMessage);
            return clarificationMessage;
          }


          const dbResult = await userService.findSupplierNearLocationByLocationName(
            locationName,
            { page: 1, limit: 5 },
            5000
          );


          const suppliersArray = dbResult || [];

          const functionResponseResult = await chat.sendMessage([
            {
              functionResponse: {
                name: "findSupplierNearLocation",
                response: {
                  suppliers: dbResult,
                  
                  count: suppliersArray.length,
                  message: suppliersArray.length > 0
                    ? `Found ${suppliersArray.length} suppliers near ${locationName}.`
                    : `No suppliers found near "${locationName}".`,
                },
              },
            },
          ]);

          const aiReply = functionResponseResult.response.text();

          return {
            prompt: userMessage,
            response: aiReply,
            suppliers: suppliersArray,
          };
        }
      }


      return response.text();

    } catch (error) {
      console.error("AI Service Error:", error.message);
      throw new Error(error.message || "AI content generation failed");
    }
  }
}


export default new Ai_Service();