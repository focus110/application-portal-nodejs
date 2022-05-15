const express = require("express");
const users = require("./routes/users");
const profileImage = require("./routes/profileImage");
const cors = require("cors");

// database
const db = require("./db/db");

const app = express();
var corsOptions = {
  origin: "http://localhost:8081",
};

// middleware
app.use(cors(corsOptions));
// parse requests of content-type - application/json
app.use(express.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// ROUTES
app.use("/users", users);
app.use("/profileImage", profileImage);

// simple route
app.get("/", (req, res) => {
  res.send("Server is running");
});

db.sync({ force: true }).then(() => {
  console.log("Drop and re-sync db.");
});

// set port, listen for requests
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Now runnig on localhost ${PORT}.`);
});
