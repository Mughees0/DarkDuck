import mongoose from "mongoose";
import RecordModeSwing from "./RecordModeSwing";
const { Schema } = mongoose;
import User from "./User";
// import timestamps from  "mongoose-timestamp";
// import uniqueValidator from "mongoose-unique-validator";

const PostSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: User },
    audio: { type: String, trim: true },
    recordModeSwingId: { type: Schema.Types.ObjectId, ref: RecordModeSwing },
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
