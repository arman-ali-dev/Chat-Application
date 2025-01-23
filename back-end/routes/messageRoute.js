const { Router } = require("express");
const router = Router();
const {
  handleSendMessage,
  handleGetAllMessages,
  handleGetAllLatestMessages,
  handleDropLatestMessages,
} = require("../controllers/messageController");

router.post("/send/:id", handleSendMessage);
router.get("/all/:id", handleGetAllMessages);
router.get("/latest/all", handleGetAllLatestMessages);
router.delete("/latest/drop/:id", handleDropLatestMessages);

module.exports = router;
