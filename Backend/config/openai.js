// config/openai.js - CORRECT GEMINI SETUP
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const openai = {
    chat: {
        completions: {
            create: async (params) => {
                try {
                    console.log('Gemini Request:', params.messages[0].content);
                    
                    const model = genAI.getGenerativeModel({ 
                        model: "gemini-pro" // Use gemini-pro for text
                    });
                    
                    const prompt = params.messages[0].content;
                    const result = await model.generateContent(prompt);
                    const response = await result.response;
                    const text = response.text();
                    
                    console.log('Gemini Response:', text);
                    
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
                    // Better fallback
                    return {
                        choices: [{
                            message: {
                                role: "assistant",
                                content: `I encountered an error. Please check your Gemini API key. Your query was: "${params.messages[0].content}"`
                            }
                        }]
                    };
                }
            }
        }
    }
};

export default openai;