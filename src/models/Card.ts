import mongoose, { Schema, Document } from "mongoose";

export interface ICard extends Document {
  boardId: string;
  title: string;
  description: string;
  status: "todo" | "inprogress" | "done";
  order: number;
}

const CardSchema: Schema = new Schema({
  boardId: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, enum: ["todo", "inprogress", "done"], required: true },
  order: { type: Number, required: false, default: 0 },
});


export default mongoose.model<ICard>("Card", CardSchema);