const express = require("express");
const connectToDB = require("./config/connectToDb");
require("dotenv").config();

// Connection To Db
connectToDB();

// Init App
const app = express();

// Middlewares
app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/authRoute"));
app.use("/api/users", require("./routes/usersRoute"));

// Running The Server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () =>
    console.log(
        `Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`
    )
);