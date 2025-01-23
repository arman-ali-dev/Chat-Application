require("dotenv").config();
const express = require("express");
const { app, server } = require("./socketIO/socket");

const PORT = process.env.PORT || 8000;
const cors = require("cors");
const path = require("path");
const cookieParser = require("cookie-parser");
const { connectMongoDB } = require("./configuration/db");

const _dirname = path.resolve();

const userRoute = require("./routes/userRoute");
const messsageRoute = require("./routes/messageRoute");
const { authentication } = require("./middlewares/authMiddleware");

app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());

connectMongoDB(process.env.MONGODB_URI)
  .then(() => console.log("Database connected!"))
  .catch(() => console.log("Database disconnected!"));

app.use("/api/users", userRoute);
app.use("/api/messages", authentication, messsageRoute);

app.use(express.static(path.join(_dirname, "/front-end/dist")));
app.get("*", (_, res) => {
  res.sendFile(path.resolve(_dirname, "front-end", "dist", "index.html "));
});

server.listen(PORT, () => console.log(`Chat-app listening on port ${PORT}!`));
