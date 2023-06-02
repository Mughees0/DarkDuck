import mongoose from "mongoose";
const { Schema } = mongoose;

const OTP = Math.floor(100000 + Math.random() * 900000);

const UserSchema = new Schema({
  username: {
    type: String,
    requeired: true,
    // unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  hashedPassword: {
    type: String,
    required: true,
    minlength: 8,
  },

  otp: {
    type: Number,
    default: OTP,
  },
  profilePicture: {
    type: String,
  },
  bannerPicture: {
    type: String,
  },
  alias: {
    type: String,
  },
  countryCode: {
    type: String,
  },
  phone: {
    type: String,
  },
  age: {
    type: String,
  },
  country: {
    type: String,
  },

  language: {
    type: String,
  },
  occupation: {
    type: String,
  },
  instruments: {
    type: Array,
  },

  research: {
    type: String,
  },
  software: {
    type: String,
  },

  highEducation: {
    type: String,
  },

  city: {
    type: String,
  },

  zipCode: {
    type: String,
  },

  termsCondition: {
    type: Boolean,
  },

  address: {
    type: String,
  },
});

UserSchema.pre("save", function (next) {
  next();
});

const User = mongoose.models.User || mongoose.model("User", UserSchema);
export default User;
