import mongoose from "mongoose";
import User from "./User";
const { Schema } = mongoose;

const SessionSchema = new Schema({
  sessionToken: {
    type: String,
    required: true,
    // unique: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: User,
    required: true,
    unique: true,
  },
  expires: {
    type: Date,
    required: true,
    minlength: 8,
  },
});

SessionSchema.pre("save", function (next) {
  next();
});

const Session =
  mongoose.models.Session || mongoose.model("Session", SessionSchema);
export default Session;
