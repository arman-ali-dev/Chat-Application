const { connect } = require("mongoose");

const connectMongoDB = async (URI) => {
  await connect(
    "mongodb+srv://armaanalidev:arman5911@chat-app.wwnnl.mongodb.net/CHAT_APP"
  );
};

module.exports = { connectMongoDB };
