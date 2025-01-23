const { connect } = require("mongoose");

const connectMongoDB = async (URI) => {
  const conn = await connect(URI);
  return conn;
};

module.exports = { connectMongoDB };
