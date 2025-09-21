import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
    userId:{ type:String, required:true ,ref:"User" },
    userName:[{ type:String, required:true }],
    name:{type:String, required:true},
    messages:[{
        isImage :{ type:Boolean, required:true },
        isPublished :{ type:Boolean, default:false },
        role:{ type:String, required:true },
        content:{ type:String, required:true },
        timestamp:{ type:Date, default:Date.now }
    }]
},{timestamps:true});

export default mongoose.model("Chat", chatSchema);