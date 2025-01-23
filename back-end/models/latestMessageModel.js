const mongoose = require("mongoose");

const latestMessageSchema = new mongoose.Schema({
  senderID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  receiverID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  content: {
    type: String,
  },
});

const LatestMessage = mongoose.model("lastestMessage", latestMessageSchema);

module.exports = LatestMessage;
