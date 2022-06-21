const dotnev = require("dotenv");
dotnev.config();

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const app = express();
const PORT = 3000;

const route = require("./routes/routes");

app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    origin: true,
    // allowedHeaders: ['X-Requested-With', 'X-HTTP-Method-Override', 'Content-Type', 'Accept']
  })
);

app.use(express.json());
app.use("/v1/api", route);

app.listen(PORT, () => {
  console.log(`Anteraja app listening on port ${PORT}`);
});
