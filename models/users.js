const mongoose = require("mongoose");

const UserModel = new mongoose.Schema(
  {
    userPhoneNumber: {
      type: String,
      require: true,
      unique: true,
    },
    userType: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      require: true,
    },
    fixitStatus: {
      type: Boolean,
      default: false,
    },
    latitude: {
      type: String,
    },
    longitude: {
      type: String,
    },
    experience: {
      type: Number,
      default: 0,
    },
    fixitName: {
      type: String,
      require: true,
    },
    WorkshopAddress: {
      type: String,
      require: true,
    },
    specialCategory: {
      type: Array,
      default: [],
    },
    fixitStatus: {
      type: Boolean,
      default: false,
    },
    fixitImage: {
      type: String,
    },
    contentType: {
      type: String,
    },
    length: {
      type: Number,
    },
    uploadDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    currentNotification: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Notification",
      default: null,
    },
    suspended: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.models.User || mongoose.model("User", UserModel);

export default User;
