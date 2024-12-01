const express = require("express");
const path = require("path");
const questionRouter = require("./routers/Question");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

const cors = require("cors");
app.use(cors());
app.options("*", cors());

app.use(questionRouter);
app.use('/public', express.static(path.join(__dirname, '../public')));

app.listen(port, () => {
  console.log("Server is up on port " + port);
});
