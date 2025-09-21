


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