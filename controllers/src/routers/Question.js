const express = require("express");

const logger = require("../logger.js");
const fs = require("fs").promises;
const path = require("path");

const router = new express.Router();

router.get("/question/json/:folderName/:fileName/:id", async (req, res) => {
  try {
    const filePath = path.join(
      __dirname,
      `../question-generators/${req.params.folderName}/json-data/${req.params.fileName}.json`
    );
    const jsonData = await fs.readFile(filePath, "utf-8");
    const questions = JSON.parse(jsonData);
    if (req.params.id < questions.length) {
      res.send({ question: questions[req.params.id] });
    } else {
      res.status(429).send({
        errorCode: "PRACTICE_LIMIT_REACHED",
        errorMessage: "Daily practice limit reached for your current subscription plan",
      });
    }
  } catch (e) {
    logger.error("Error while getting questions: ", e);
    res.status(500).send(e);
    return;
  }
});

module.exports = router;
