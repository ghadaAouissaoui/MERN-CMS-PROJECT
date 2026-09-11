const express = require("express");
const mongoos = require("mongoose");
const cors = require('cors');
const multer = require("multer");
const requestIp = require("request-ip");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const connectDB=require('./config/db')
const port = process.env.PORT || 3030
const app = express();
const path = require('path');
connectDB()

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:3000', // ou votre URL frontend
  credentials: true,
}));
app.use(requestIp.mw());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use((req, res, next) => {
  const allowedOrigins = process.env.ALLOW_ORIGINES || "http://localhost:3000";
  res.setHeader("Access-Control-Allow-Origin", allowedOrigins);
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, DELETE, PATCH, PUT"
  );
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type , Authorization");
  next();
});

// add rateLimit later
//
// code here
//


const publicRoutes = require("./routes/public");
const authRoutes = require("./routes/auth");
const profileRoutes = require("./routes/profile");
const postRoutes = require("./routes/post");

app.use("/public", publicRoutes);
app.use("/auth", authRoutes);
app.use("/profile", profileRoutes);
app.use("/post", postRoutes);

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode;
  const message = error.messsage;
  const data = error.data;
  res
    .status(status || 500)
    .json({ message: message, data: data, error: "yes", errors: error });
});


app.listen(process.env.PORT || port, () => {
      console.log(`listning to the port ${port}`);
    });
 