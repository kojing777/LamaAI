import Chat from "../models/Chat.js";
import User from "../models/User.js";
import axios from "axios";
import openai from "../config/openai.js";
import imagekit from "../config/imagekit.js";


//text-based ai chat maessage controller
export const textMessageController = async (req, res) => {
    try {
        const userId = req.user._id;
        if (req.user.credits < 1) {
            return res.status(403).json({ success: false, message: "Credit pugena raja" });
        }
        const { chatId, prompt } = req.body;
        
        if (!chatId || !prompt) {
            return res.status(400).json({ success: false, message: "chatId and prompt are required" });
        }

        const chat = await Chat.findOne({ userId, _id: chatId });
        if (!chat) {
            return res.status(404).json({ success: false, message: "Chat not found" });
        }

        chat.messages.push({
            isImage: false,
            role: "user",
            content: prompt,
            timestamp: Date.now()
        });
        
        const { choices } = await openai.chat.completions.create({
            model: "gemini-2.0-flash",
            messages: [
                {
                    role: "user",
                    content: prompt,
                },
            ],
        });
        
        if (!choices || !choices[0] || !choices[0].message) {
            return res.status(500).json({ success: false, message: "Failed to get response from AI" });
        }
        
        const reply = { ...choices[0].message, timestamp: Date.now(), isImage: false };
        
        chat.messages.push(reply);
        await chat.save();

        await User.updateOne({ _id: userId }, { $inc: { credits: -1 } });
        
        res.status(200).json({ success: true, reply });

    } catch (error) {
        console.error('Error in textMessageController:', error);
        res.status(500).json({ success: false, message: error.message, error: error.stack });
    }
}

//image-based ai chat maessage controller
export const imageMessageController = async (req, res) => {
    try {
        const userId = req.user._id;
        if (req.user.credits < 2) {
            return res.status(403).json({ success: false, message: "Credit pugena raja" });
        }
        const { prompt, chatId, isPublished } = req.body;
        
        if (!chatId || !prompt) {
            return res.status(400).json({ success: false, message: "chatId and prompt are required" });
        }
        
        const chat = await Chat.findOne({ userId, _id: chatId });
        if (!chat) {
            return res.status(404).json({ success: false, message: "Chat not found" });
        }

        //push user message to chat
        chat.messages.push({
            isImage: false,
            role: "user",
            content: prompt,
            timestamp: Date.now()
        });

        //encode prompt
        const encodedPrompt = encodeURIComponent(prompt);

        //construct imagekit api generation url
        const generatedImageUrl = `${process.env.IMAGEKIT_URL_ENDPOINT}/ik-genimg-prompt-/${encodedPrompt}/quickgpt/${Date.now()}.png?tr=w-800,h-800`;
        console.log('Generated ImageKit URL:', generatedImageUrl);

        let aiImageResponse;
        try {
            aiImageResponse = await axios.get(generatedImageUrl, { responseType: 'arraybuffer' });
            console.log('AI Image Response Status:', aiImageResponse.status);
        } catch (err) {
            console.error('Error fetching image from ImageKit:', err.response ? err.response.data : err.message);
            return res.status(500).json({ success: false, message: 'Failed to generate image', error: err.response ? err.response.data : err.message });
        }

        //convert to base64
        let base64Image;
        try {
            base64Image = `data:image/png;base64,${Buffer.from(aiImageResponse.data, 'binary').toString('base64')}`;
        } catch (err) {
            console.error('Error converting image to base64:', err.message);
            return res.status(500).json({ success: false, message: 'Failed to convert image to base64', error: err.message });
        }

        //upload image to imagekit media library
        let uploadResponse;
        try {
            uploadResponse = await imagekit.upload({
                file: base64Image,
                fileName: `quickgpt/${Date.now()}.png`,
                folder: 'quickgpt'
            });
            console.log('ImageKit Upload Response:', uploadResponse);
        } catch (err) {
            console.error('Error uploading to ImageKit:', err.message);
            return res.status(500).json({ success: false, message: 'Failed to upload image to ImageKit', error: err.message });
        }

        const reply = {
            isImage: true,
            role: "assistant",
            timestamp: Date.now(),
            isPublished,
            content: uploadResponse.url
        };
        res.status(200).json({ success: true, reply });
        chat.messages.push(reply);
        await chat.save();

        await User.updateOne({ _id: userId }, { $inc: { credits: -2 } });
    } catch (error) {
        console.error('General error in imageMessageController:', error.message);
        res.status(500).json({ success: false, message: error.message });
    }
}