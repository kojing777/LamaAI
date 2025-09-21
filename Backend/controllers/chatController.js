import chat from "../models/Chat.js";



//Api controller for new chat
export const createChat = async (req, res) => {
    try {
        const userId = req.user._id;
        const chatData = {
            userId,
            messages: [],
            name: "New Chat",
            userName: [req.user.name]
        };
        await chat.create(chatData);
        res.json({ success: true, message: "Chat created successfully" });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}

//Api Controller for getting all chats of a user
export const getChats = async (req, res) => {
    try {
        const userId = req.user._id;
        const chats = await chat.find({ userId }).sort({ updatedAt: -1 });

        res.json({ success: true, chats });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

//Api Controller for deleting a chat
export const deleteChat = async (req, res) => {
    try {
        const userId = req.user._id;
        const { chatId } = req.body;

        await chat.deleteOne({ _id: chatId, userId });
        res.json({ success: true, message: "Chat deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}
