const express = require("express");
const axios = require("axios");
const cors = require("cors");

require("dotenv").config();

const app = express();
app.use(cors());
const port = 8888;

const LINE_API_URL = "https://api.line.me/v2/bot/message/push";

app.use(express.json());

const headers = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${process.env.LINE_ACCESS_TOKEN}`,
};

const sendMessage = async (userUid, message) => {
  const body = {
    to: userUid,
    messages: [
      {
        type: "text",
        text: message,
      },
    ],
  };

  const response = await axios.post(LINE_API_URL, body, { headers });
  return response;
};

app.post("/send-message", async (req, res) => {
  const { userUid, message } = req.body;
  console.log("=== LINE log", userUid, message);

  try {
    const response = await sendMessage(userUid, message);
    console.log("=== LINE log", response.data);
    res.json({
      message: "Send message success",
      response: response.data,
    });
  } catch (error) {
    console.log("error", error.response?.data);
    res.status(400).json({
      error: error.response?.data || {
        message: error.message || "An error occurred",
      },
    });
  }
});

app.listen(port, async () => {
  console.log(`Express app listening at http://localhost:${port}`);
});
