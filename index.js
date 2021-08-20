const express = require("express");
const mongoose = require("mongoose");
// const { MongoClient } = require("mongodb");
const cors = require("cors");
const bodyParser = require("body-parser");
const routesHandler = require("./creative-agency/user/routesHandler");
const adminroutesHandler = require("./creative-agency/admin/adminRoutes");
const makeAdmin = require("./creative-agency/makeAdmin/makeAdminRoutes");
const reviewRoute = require("./creative-agency/review/reviewRoute");
const fileUpload = require("express-fileupload");
const fs = require("fs")

const app = express();
const port = 4000 || process.env.PORT;

//static folder
app.use(express.static(__dirname + "/uploads"));
//express middleware
app.use(express.json());
app.use(cors());-
app.use(bodyParser.json());
app.use(fileUpload());
require("dotenv").config();
// customer
app.use("/creative-agency", routesHandler);
app.use("/review", reviewRoute);
//admin
app.use("/admin", adminroutesHandler);
app.use("/make-admin", makeAdmin);
//mehedi....20 Database
const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.rggmg.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
mongoose
  .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("database connect");
  })
  .catch((err) => {
    console.log(err);
  });

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get('/images', (req, res) => {
  fs.readdir('./uploads', (err, files) => {
    let array = [];
    files.forEach(file => {
      const imageName = {
        name: file
      };
      array.push(imageName);
    });
    res.send(array);
  });
});

app.post("/upload", (req, res) => {
  if (req.files == null) {
    res.status(404).json({ message: "no file upload" });
  }
  const file = req.files.file;
  file.mv(`${__dirname}/uploads/${file.name}`),
    (err) => {
      if (err) {
        res.status(500).json({ error: "Failed to upload image..." });
      }
      res.status(200).json({ message: "file upload successfully." });
    };
  res.send({ message: "File upload successfully." });
});

app.delete("/delete/image/:imageName", (req, res) => {
  console.log(req.params.imageName);
  fs.unlink(`./uploads/${req.params.imageName}`, (err) => {
    if (err) throw err;
    console.log("photo deleted successfully");
    res.status(200).json({ message: "Photo deleted successfully." });
  });
});

app.get("*", (req, res) => {
  res.json({ error: "404 not found" });
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
