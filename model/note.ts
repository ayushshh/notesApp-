import mongoose, {Document, Schema} from "mongoose";

interface INote extends Document{
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

const noteSchema = new Schema<INote>({
    title : {
        type : String,
        required : true,
        maxLength : 100
    },
    content : {
        type : String,
        required : true,
        maxLength: 2000
    },
    createdAt : {
        type: Date,
        default: Date.now
    },
    updatedAt : {
        type : Date,
        default : Date.now
    }
}, {timestamps : true})

export const Note = mongoose.model<INote>("Note", noteSchema);