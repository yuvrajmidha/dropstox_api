const mongoose = require("mongoose");

const formSchema = new mongoose.Schema(
  {
    _id: mongoose.Types.ObjectId,
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      max: 48
    },
    fields: {
        type: Object,
        require: false,
    },
    config: {
        authentication: {
            type: Boolean,
            default: false,
            require: true
        },
        blockedEmails: [{
            type: String,
            trim: true,
            validate: [/\S+@\S+\.\S+/, "Please enter a valid email"]
        }],
        maximumSubmissions: {
            type: Number
        },
        oneSubmissionPerPerson: {
            type: Boolean,
            default: false,
            require: true
        },
        expiresOn: {
            type: Date,
        },
        status: {
            type: String,
            default: "Accepting",
            require: true
        }
    },
    submissions: [{
        type: Object,
    }]
  },
  //for storing the update and create time
  { timestamps: true }
);



module.exports = mongoose.model("Form", formSchema);