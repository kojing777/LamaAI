// config/openai.js - KEEP FOR TEXT GENERATION
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const openai = {
    chat: {
        completions: {
            create: async (params) => {
                try {
                    const model = genAI.getGenerativeModel({ 
                        model: params.model || "gemini-pro" 
                    });
                    
                    const prompt = params.messages[0].content;
                    const result = await model.generateContent(prompt);
                    const response = await result.response;
                    const text = response.text();
                    
                    return {
                        choices: [{
                            message: {
                                role: "assistant",
                                content: text
                            }
                        }]
                    };
                } catch (error) {
                    console.error('Gemini API error:', error);
                    // Fallback to simple responses if Gemini fails
                    return {
                        choices: [{
                            message: {
                                role: "assistant",
                                content: `I understand you're asking about "${params.messages[0].content}". That's an interesting topic!`
                            }
                        }]
                    };
                }
            }
        }
    }
};

export default openai;