const mongoose=require("mongoose")

const PostSchema=mongoose.Schema({
    username: String,
    title: String,
    content: String,
    category:String,
    date: { type: Date, default: new Date() },
    likes:{type:Number,default:0},
    comments:[{
        content: {type: String},
        username:{type:mongoose.Types.ObjectId,ref:'user'}
    }],
    userId:{type:mongoose.Types.ObjectId,ref:'user'}
})

const PostModel = mongoose.model("Post", PostSchema)
module.exports={
    PostModel
}






