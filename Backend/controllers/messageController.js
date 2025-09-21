import chat from "../models/Chat.js";



//text-based ai chat maessage controller
export const textMessageController = async (req, res) => {
    try {
        const userId = req.user._id;
        const { chatId, prompt } = req.body;
        // Process the text message (e.g., save to database, send to AI service, etc.)
        // For demonstration, we'll just return the received message
        const chat = await chat.findOne({ userId, _id: chatId });
        chat.messages.push({
            isImage: false,
            role: "user",
            content: prompt,
            timestamp: Date.now()
        });
        await chat.save();
        res.json({ success: true, message: "Text message processed", data: { chatId, prompt } });
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error", error: error.message });
    }
}