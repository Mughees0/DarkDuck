import mongoose from "mongoose";
import RecordModeSwing from "./RecordModeSwing";
const { Schema } = mongoose;
import User from "./User";
import { data } from "autoprefixer";
// import timestamps from  "mongoose-timestamp";
// import uniqueValidator from "mongoose-unique-validator";

const PostSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: User },
    audio: { type: String, trim: true },
    recordModeSwingId: { type: Schema.Types.ObjectId, ref: RecordModeSwing },
    updatedAt: { type: Date, default: Date.now() },
    createdAt: { type: Date, default: Date.now() },
  }
  //   {
  //     strict: true,
  //   },
  //   {
  //     timestamps: true,
  //   }
);

PostSchema.pre("save", function (next) {
  next();
});

// PostSchema.plugin(timestamps);
// PostSchema.plugin(uniqueValidator);
const Post = mongoose.models.Post || mongoose.model("Post", PostSchema);
export default Post;
