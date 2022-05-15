const router = require("express").Router();
const { check } = require("express-validator");

const {
  listImages,
  uploadImage,
  updateImageById,
  deleteImageById,
  findImagebyId,
} = require("../controllers/profileImageController");

const { authUser, isAdmin } = require("../helper/jwt");

// fetch all users*
router.get("/", [authUser, isAdmin], listImages);

// fetch user by id*
router.get("/:id", [authUser], findImagebyId);

// Create user*
router.post("/upload", authUser, uploadImage);

// Update user*
router.put("/:id", [authUser], updateImageById);

// Delete user
router.delete("/:id", [authUser], deleteImageById);

module.exports = router;
