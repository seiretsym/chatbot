// dependencies
require("dotenv").config();
const express = require("express");
const session = require("express-session");

// express middleware
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// for heroku & vue
if (process.env.NODE_ENV === "production") {
  app.use(express.static("chatbot/dist"));
}

// session config
app.use(session({ secret: process.env.SESSION_SECRET, resave: true, saveUninitialized: true }))

// start server
const PORT = process.env.PORT || 3377;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`)
})