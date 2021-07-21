// dependencies
require("dotenv").config();
const express = require("express");
const session = require("express-session");
const routes = require("./routes");

// express middleware
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// for heroku & vue
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/dist"));
}

// session config
app.use(session({ secret: process.env.SESSION_SECRET, resave: true, saveUninitialized: true }))

// connect routes
app.use(routes);


// start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`)
})