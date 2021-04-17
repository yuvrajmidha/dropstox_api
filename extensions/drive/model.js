const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true
    },
    fileType: {
      type: String,
      required: true
    },
    category: {
      type: String,
      default: "General",
    },
    caption: String,
    description: String,
    tags: Array
  },
  //for storing the update and create time
  { timestamps: true }
);



module.exports = mongoose.model("File", fileSchema);