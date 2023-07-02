import mongoose from "mongoose";
const { Schema } = mongoose;
import User from "./User";

// import timestamps from  "mongoose-timestamp";
// import uniqueValidator from "mongoose-unique-validator";

const PostSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: User },
  audio: { type: String, trim: true },
  audience: { type: String, default: "public" },
  text: { type: String, trim: true },
  data: { type: Array, trim: true },
  updatedAt: { type: Date, default: Date.now() },
  createdAt: { type: Date, default: Date.now() },
  likes: { type: Array, default: [ ] },
  comments: { type: Array },
});

PostSchema.pre("save", function (next) {
  next();
});

// PostSchema.plugin(timestamps);
// PostSchema.plugin(uniqueValidator);
const Post = mongoose.models.Post || mongoose.model("Post", PostSchema);
export default Post;
