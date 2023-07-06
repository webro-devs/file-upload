const path = require("path");
const cors = require("cors");
const express = require("express");
const fileUpload = require("express-fileupload");
const combineRouters = require("./routers/index.js");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.resolve(__dirname, "../../uploads")));
app.use(
  fileUpload({
    tempFileDir: "temp",
    useTempFiles: true,
  })
);

combineRouters(app);

app.use((err, req, res, next) => {
  res
    .status(err.status || 400)
    .send(
      err || {
        error: true,
        status: 400,
        message: err.message || "Something went wrong",
      }
    );
  next();
});

app.listen(process.env.PORT, () => console.log(`Server is running on ${process.env.PORT} port`));
