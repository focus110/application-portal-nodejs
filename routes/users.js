const router = require("express").Router();
const { check } = require("express-validator");

const {
  listUsers,
  createUser,
  updateUserById,
  loginUser,
  deleteUserById,
  findUserbyId,
} = require("../controllers/userController");

const { authUser, isAdmin } = require("../helper/jwt");

// fetch all users*
router.get("/", [authUser, isAdmin], listUsers);

// fetch user by id*
router.get("/:id", [authUser], findUserbyId);

// Create user*
router.post(
  "/signup",
  [
    check("email", "Provide a valid email").isEmail(),
    check("password", "Password should be more than 6").isLength({ min: 6 }),
  ],
  createUser
);

// Update user*
router.put("/:id", [authUser], updateUserById);

// Login user*
router.post("/login", loginUser);

// Reset password
router.post("/forget-password", (req, res) => {
  res.send("forget password");
});

// Delete user
router.delete("/:id", [authUser], deleteUserById);

module.exports = router;

// router.get("/", checkAuth, createuser);
// router.get("/", (req, res) => {
//   console.log("user route");
//   res.send("users");
// });

module.exports = router;
