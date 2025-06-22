import mongoose from 'mongoose';

const BoardSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  name: String,
  cards: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Card' }]
});

export default mongoose.model('Board', BoardSchema);
