import mongoose from "mongoose";
const { Schema } = mongoose;
// const timestamps = require("mongoose-timestamp");
// const uniqueValidator = require("mongoose-unique-validator");

const RecordModeSwingSchema = new Schema(
  {
    name: { type: String, trim: true },
  }
  //   {
  //     strict: true,
  //   },
  //   {
  //     timestamps: true,
  //   }
);

RecordModeSwingSchema.pre("save", function (next) {
  next();
});

// RecordModeSwingSchema.plugin(timestamps);
// RecordModeSwingSchema.plugin(uniqueValidator);

const RecordModeSwing =
  mongoose.models.RecordModeSwingSchema ||
  mongoose.model("RecordModeSwingSchema", RecordModeSwingSchema);
export default RecordModeSwing;
