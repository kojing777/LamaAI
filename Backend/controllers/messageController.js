// controllers/messageController.js - USING BOTH SERVICES
import Chat from "../models/Chat.js";
import User from "../models/User.js";
import axios from "axios";
import imagekit from "../config/imagekit.js";
import openai from "../config/openai.js"; // Keep this import!

// Text-based AI chat message controller - USING GEMINI
export const textMessageController = async (req, res) => {
    try {
        const userId = req.user._id;
        if (req.user.credits < 1) {
            return res.status(403).json({ success: false, message: "Insufficient credits" });
        }
        
        const { chatId, prompt } = req.body;
        
        const chat = await Chat.findOne({ userId, _id: chatId });
        if (!chat) {
            return res.status(404).json({ success: false, message: "Chat not found" });
        }

        // Add user message to chat
        chat.messages.push({
            isImage: false,
            role: "user",
            content: prompt,
            timestamp: Date.now()
        });

        // Use Gemini for intelligent text responses
        let aiResponse;
        try {
            const response = await openai.chat.completions.create({
                model: "gemini-pro",
                messages: [{ role: "user", content: prompt }],
            });
            aiResponse = response.choices[0].message.content;
        } catch (error) {
            console.error('Gemini API failed, using fallback:', error);
            aiResponse = await generateFreeTextResponse(prompt);
        }

        const reply = {
            isImage: false,
            role: "assistant",
            content: aiResponse,
            timestamp: Date.now()
        };

        // Add AI response to chat and save
        chat.messages.push(reply);
        await chat.save();
        await User.updateOne({ _id: userId }, { $inc: { credits: -1 } });

        res.status(200).json({ success: true, reply });

    } catch (error) {
        console.error('Error in textMessageController:', error);
        res.status(500).json({ success: false, message: error.message });
    }
}

// Free text fallback (if Gemini fails)
const generateFreeTextResponse = async (prompt) => {
    const lowerPrompt = prompt.toLowerCase();
    
    if (lowerPrompt.includes('hello') || lowerPrompt.includes('hi')) {
        return "Hello! I'm your AI assistant. How can I help you today?";
    } else if (lowerPrompt.includes('how are you')) {
        return "I'm doing great! Ready to help you with anything you need.";
    } else if (lowerPrompt.includes('thank')) {
        return "You're welcome! Is there anything else I can help you with?";
    } else {
        return `I understand you're asking about "${prompt}". That's an interesting topic! In my AI perspective, this is something worth exploring further.`;
    }
}

// Image-based AI chat message controller - USING LOREM PICSUM (FREE)
export const imageMessageController = async (req, res) => {
    try {
        const userId = req.user._id;
        if (req.user.credits < 2) {
            return res.status(403).json({ success: false, message: "Insufficient credits. Image generation requires 2 credits." });
        }
        
        const { prompt, chatId, isPublished = false } = req.body;
        
        if (!prompt || !chatId) {
            return res.status(400).json({ success: false, message: "Prompt and chatId are required" });
        }

        const chat = await Chat.findOne({ userId, _id: chatId });
        if (!chat) {
            return res.status(404).json({ success: false, message: "Chat not found" });
        }

        // Push user message to chat
        chat.messages.push({
            isImage: false,
            role: "user",
            content: prompt,
            timestamp: Date.now()
        });

        // Generate image using FREE Lorem Picsum
        const imageUrl = await generateLoremPicsumImage(prompt);
        
        console.log('Generated Image URL:', imageUrl);

        // Download and upload to ImageKit
        let imageResponse;
        try {
            imageResponse = await axios.get(imageUrl, { 
                responseType: 'arraybuffer',
                timeout: 30000
            });
        } catch (err) {
            console.error('Error downloading image:', err.message);
            return await handleImageFallback(res, prompt, chat, userId, isPublished);
        }

        const base64Image = Buffer.from(imageResponse.data).toString('base64');

        let uploadResponse;
        try {
            uploadResponse = await imagekit.upload({
                file: base64Image,
                fileName: `quickgpt-${Date.now()}.jpg`,
                folder: '/quickgpt',
                useUniqueFileName: true
            });
        } catch (err) {
            console.error('ImageKit upload failed:', err);
            uploadResponse = { url: imageUrl };
        }

        const reply = {
            isImage: true,
            role: "assistant",
            content: uploadResponse.url,
            timestamp: Date.now(),
            isPublished: Boolean(isPublished)
        };

        // Save to database
        chat.messages.push(reply);
        await chat.save();
        await User.updateOne({ _id: userId }, { $inc: { credits: -2 } });

        res.status(200).json({ 
            success: true, 
            reply,
            message: "Image generated successfully!"
        });

    } catch (error) {
        console.error('Error in imageMessageController:', error);
        res.status(500).json({ 
            success: false, 
            message: "Image generation failed. Please try again."
        });
    }
}

// Lorem Picsum image generation (FREE)
const generateLoremPicsumImage = (prompt) => {
    const seed = createSeedFromPrompt(prompt);
    const style = getImageStyleFromPrompt(prompt);
    return `https://picsum.photos/800/800?${style}&random=${seed}`;
}

const createSeedFromPrompt = (prompt) => {
    let hash = 0;
    for (let i = 0; i < prompt.length; i++) {
        const char = prompt.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return Math.abs(hash) + Date.now();
}

const getImageStyleFromPrompt = (prompt) => {
    const lowerPrompt = prompt.toLowerCase();
    
    if (lowerPrompt.includes('nature') || lowerPrompt.includes('forest')) {
        return 'grayscale&blur=1';
    } else if (lowerPrompt.includes('city') || lowerPrompt.includes('urban')) {
        return 'blur=2';
    } else if (lowerPrompt.includes('abstract') || lowerPrompt.includes('art')) {
        return 'grayscale';
    } else {
        return Math.random() > 0.5 ? 'blur=1' : '';
    }
}

// Fallback function (same as before)
const handleImageFallback = async (res, prompt, chat, userId, isPublished) => {
    try {
        const svgContent = `...`; // Your SVG fallback code
        const base64Svg = Buffer.from(svgContent).toString('base64');
        
        const uploadResponse = await imagekit.upload({
            file: base64Svg,
            fileName: `fallback-${Date.now()}.svg`,
            folder: '/quickgpt',
            useUniqueFileName: true
        });

        const reply = {
            isImage: true,
            role: "assistant",
            content: uploadResponse.url,
            timestamp: Date.now(),
            isPublished: Boolean(isPublished)
        };

        chat.messages.push(reply);
        await chat.save();
        await User.updateOne({ _id: userId }, { $inc: { credits: -2 } });

        res.status(200).json({ 
            success: true, 
            reply,
            message: "Image generated successfully (fallback mode)!"
        });
        
        return true;
    } catch (fallbackError) {
        console.error('Fallback also failed:', fallbackError);
        throw new Error('Image generation and fallback both failed');
    }
}