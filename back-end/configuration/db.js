const { connect } = require("mongoose");

const connectMongoDB = async (URI) => {
  const conn = await connect(
    "mongodb+srv://armaanalidev:arman5911@chat-app.wwnnl.mongodb.net/CHAT_APP"
  );
  return conn;
};

module.exports = { connectMongoDB };
