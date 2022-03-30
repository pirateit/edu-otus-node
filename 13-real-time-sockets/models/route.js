import mongoose from 'mongoose';
const { Schema } = mongoose;

const locationSchema = new Schema({
  locationData: [{ type: Number, required: true }],
  currentDateTime: { type: Date, default: Date.now },
});

const routeSchema = new Schema({
  userSocketId: { type: String, required: true, unique: true },
  routePoints: [locationSchema]
});

export default mongoose.model('Route', routeSchema);
