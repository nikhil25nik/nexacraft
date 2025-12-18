import mongoose from "mongoose";

const creationSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    prompt:{
        type:String,
        required:true,
        trim:true
    },
    content:{
        type:String,
        required:true,
        trim:true
    },
    type:{
        type:String,
        required:true,
        trim:true
    },
    publish:{
        type:Boolean,
        default:false
    },
    likes:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        }
    ]
},{timestamps:{
    createdAt:"created_at",
    updatedAt:false
}})

const Creation = mongoose.model("Creation",creationSchema);

export default Creation;