const Conversation = require("../models/conversationModel");
const LatestMessage = require("../models/latestMessageModel");
const Message = require("../models/messageModel");
const { getSocketID, io } = require("../socketIO/socket");

const handleSendMessage = async (req, res) => {
  try {
    const senderID = req._id;
    const receiverID = req.params.id;

    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ msg: "text is required!" });
    }

    let conversation;

    conversation = await Conversation.findOne({
      participants: { $all: [senderID, receiverID] },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderID, receiverID],
      });
    }

    const messageData = {
      senderID,
      receiverID,
      content: text,
    };

    const newMessage = await Message.create(messageData);
    await LatestMessage.create(messageData);

    conversation.messages.push(newMessage._id);
    await conversation.save();

    const receiverSocketID = getSocketID(receiverID);

    if (receiverSocketID) {
      io.to(receiverSocketID).emit("newMessage", newMessage);
      io.to(receiverSocketID).emit("latestMessage", newMessage);
    }

    return res.status(201).json({ message: newMessage });
  } catch (error) {
    return res.status(500).json({ msg: "internal server error!" });
  }
};

const handleGetAllMessages = async (req, res) => {
  try {
    const senderID = req._id;
    const receiverID = req.params.id;

    const messages = await Conversation.findOne({
      participants: { $all: [senderID, receiverID] },
    }).populate("messages");

    if (!messages) {
      return res.status(200).json({ messages: [] });
    }

    return res.status(200).json({ messages: messages.messages });
  } catch (error) {
    return res.status(500).json({ msg: "internal server error!" });
  }
};

const handleGetAllLatestMessages = async (req, res) => {
  try {
    const userID = req._id;
    console.log("userID", userID);

    const messages = await LatestMessage.find({ receiverID: userID });

    return res.status(200).json({ latestMessages: messages });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ msg: "internal server error!" });
  }
};

const handleDropLatestMessages = async (req, res) => {
  try {
    const receiverID = req._id;
    const senderID = req.params.id;

    const result = await LatestMessage.deleteMany({ receiverID, senderID });

    return res.status(200).json({ success: true, counts: result.deletedCount });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ msg: "internal server error!" });
  }
};

module.exports = {
  handleSendMessage,
  handleGetAllMessages,
  handleGetAllLatestMessages,
  handleDropLatestMessages,
};
