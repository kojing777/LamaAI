import imagekit from "../config/imagekit.js";
import Chat from "../models/Chat.js";
import User from "../models/User.js";
import axios from "axios";


//text-based ai chat maessage controller
export const textMessageController = async (req, res) => {
    try {
        const userId = req.user._id;
        const { chatId, prompt } = req.body;
        // Process the text message (e.g., save to database, send to AI service, etc.)
        // For demonstration, we'll just return the received message
        const chat = await Chat.findOne({ userId, _id: chatId });
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
        const reply = { ...choices[0].message, timestamp: Date.now(), isImage: false };
        res.status(200).json({ success: true, reply });

        chat.messages.push(reply);
        await chat.save();

        await User.updateOne({ _id: userId }, { $inc: { credits: -1 } });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
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
        const chat = await Chat.findOne({ userId, _id: chatId });

        //push user message to chat
        chat.messages.push({
            isImage: false,
            role: "user",
            content: prompt,
            timestamp: Date.now()
        });
        const encodedPrompt = encodeURIComponent(prompt);

        //construct imagekit api generation url
        const generatedImageUrl = `${process.env.IMAGEKIT_URL_ENDPOINT}/ik-genimg-prompt-/${encodedPrompt}/quickgpt/${Date.now()}.png?tr=w-800,h-800`;

        //trigger generation by calling the imagekit
        const aiImageResponse = await axios.get(generatedImageUrl, { responseType: 'arraybuffer' });
        // console.log("AI IMAGE RESPONSE", aiImageResponse.data);

        //convert to base64
        const base64Image = `data:image/png;base64,${Buffer.from(aiImageResponse.data, 'binary').toString('base64')}`;

        //upload image to imagekit media library
        const uploadResponse = await imagekit.upload({
            file: base64Image,
            fileName: `quickgpt/${Date.now()}.png`,
            folder: 'quickgpt'
        });
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
        res.status(500).json({ success: false, message: error.message });
    }
}