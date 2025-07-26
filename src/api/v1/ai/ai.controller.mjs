import Ai_Service from "./ai.service.mjs";
import SendResponse from "../../../utils/SendResponse.mjs";
import StatusCodeConstant from "../../../constant/StatusCode.constant.mjs";
import aiService from "./ai.service.mjs";

class Ai_Controller {
  async chatWithAI(req, res) {
    try {
      // Extract data from req.body
    
      const aiData = req.body;

      // Call the Ai_Service to process the AI chat
      const aiResponse = await Ai_Service.chatWithAI(aiData);

      // Send a successful response with the AI result
      SendResponse.success(
        res,
        StatusCodeConstant.SUCCESS,
        "AI response generated successfully.",
        aiResponse
      );
    } catch (error) {
      // Handle errors and send an error response
      SendResponse.error(
        res,
        StatusCodeConstant.INTERNAL_SERVER_ERROR,
        error.message || "Failed to generate AI response."
      );
    }
  }
}

export default new Ai_Controller();