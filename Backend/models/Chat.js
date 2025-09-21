import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
    userId: { type: String, required: true, ref: "User" },
    userName: [{ type: String, required: true }],
    name: { type: String, required: true },
    messages: [{
        isImage: { type: Boolean, required: true },
        isPublished: { type: Boolean, default: false },
        role: { type: String, required: true },
        content: { type: String, required: true },
        timestamp: { type: Number, required: true, default: Date.now }
    }]
}, { timestamps: true });

const chat = mongoose.model("Chat", chatSchema);

export default chat;