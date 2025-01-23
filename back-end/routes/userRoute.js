const { Router } = require("express");
const router = Router();
const upload = require("../middlewares/multer");
const { authentication } = require("../middlewares/authMiddleware");

const {
  handleUserRegisteration,
  handleUserLogin,
  handleLogoutUser,
  handleGetAllUser,
  handleEditProfile,
} = require("../controllers/userControllers");

router.post("/signup", handleUserRegisteration);
router.post("/login", handleUserLogin);
router.get("/logout", authentication, handleLogoutUser);

router.get("/all", authentication, handleGetAllUser);
router.patch(
  "/edit",
  authentication,
  upload.single("profileImage"),
  handleEditProfile
);

module.exports = router;
