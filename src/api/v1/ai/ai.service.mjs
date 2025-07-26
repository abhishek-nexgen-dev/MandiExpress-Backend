import axios from "axios";
import userService from "../user/user.service.mjs";
import envConstant from "../../../constant/env.constant.mjs";

class Ai_Service {
  async chatWithAI(aiData) {
    try {
      const userMessage = aiData.message || "Find suppliers near me";

      // Parse message manually to extract location (basic implementation)
      const locationMatch = userMessage.match(/(?:near|in|at)\s+(.+)/i);
      const locationName = locationMatch ? locationMatch[1].trim() : null;

      if (!locationName) {
        return {
          prompt: userMessage,
          response: `Could not extract location from message: "${userMessage}". Try saying something like "Find suppliers near Delhi, India".`,
          suppliers: [],
        };
      }

      // 1. Check DB first
      let dbResult = await userService.findSupplierNearLocationByLocationName(
        locationName,
        { page: 1, limit: 5 },
        5000
      );

      // 2. If DB empty → use Hugging Face
      if (!dbResult || dbResult.length === 0) {
        console.log("📡 No suppliers found in DB. Using Hugging Face AI...");

        dbResult = await this.getSuppliersFromHuggingFace(locationName);
      }

      const replyMessage =
        dbResult.length > 0
          ? `Found ${dbResult.length} suppliers near "${locationName}".`
          : `No suppliers found or predicted near "${locationName}".`;

      return {
        prompt: userMessage,
        response: replyMessage,
        suppliers: dbResult,
      };
    } catch (error) {
      console.error("AI Service Error:", error.message);
      throw new Error(error.message || "AI supplier search failed");
    }
  }

  /**
   * 🔁 Use Hugging Face Inference API to generate supplier suggestions
   */
  async getSuppliersFromHuggingFace(locationName) {
    try {
      const prompt = `List 3 business suppliers near ${locationName} with their name, type, and category in a JSON array format.`;

      const response = await axios.post(
        "https://api-inference.huggingface.co/models/mistralai/Mixtral-8x7B-Instruct-v0.1",
        {
          inputs: prompt,
        },
        {
          headers: {
            Authorization: `Bearer ${envConstant.HUGGINGFACE_API_KEY}`,
          },
          timeout: 20000,
        }
      );

      const rawText =
        response.data?.[0]?.generated_text || response.data.generated_text;

      if (!rawText) return [];

      const jsonStart = rawText.indexOf("[");
      const jsonEnd = rawText.lastIndexOf("]") + 1;
      const jsonString = rawText.slice(jsonStart, jsonEnd);

      const parsed = JSON.parse(jsonString);

      return parsed.map((supplier) => ({
        name: supplier.name || "Unknown Supplier",
        type: supplier.type || "general",
        category: supplier.category || "misc",
        location: locationName,
        source: "huggingface",
      }));
    } catch (error) {
      console.error("Hugging Face API Error:", error.message);
      return [];
    }
  }
}

export default new Ai_Service();
