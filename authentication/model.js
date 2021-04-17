const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    _id: mongoose.Types.ObjectId,
    email: {
      type: String,
      trim: true,
      required: [true, "Email is required"],
      unique: [true, "Email already exist"],
      validate: [/\S+@\S+\.\S+/, "Please enter a valid email"]
    },
    verified: {
      type: Boolean,
      default: false
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    oldPassword: {
      type: String
    },
    passwordChangedOn: {
      type: Date
    },
    role: {
      type: String,
      require: true
    },
    permissions: {
      type: Array,
      default: ["General"]
    }
  },
  //for storing the update and create time
  { timestamps: true }
);



module.exports = mongoose.model("Account", userSchema);