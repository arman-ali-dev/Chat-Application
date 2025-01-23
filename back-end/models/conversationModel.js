const mongoose = require("mongoose");
const Message = require("./messageModel");
const User = require("./userModel");

const conversationSchema = new mongoose.Schema(
  {
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User ",
      },
    ],

    messages: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "message",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Conversation = mongoose.model("conversation", conversationSchema);

module.exports = Conversation;
