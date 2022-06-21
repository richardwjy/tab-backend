const express = require("express");
const dotnev = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
dotnev.config();
const app = express();
const port = 3000;

const routes = require("./routes/routes");

app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(
  cors({
    credentials: true,
    origin: true,
    // allowedHeaders: ['X-Requested-With', 'X-HTTP-Method-Override', 'Content-Type', 'Accept']
  })
);

app.use("/api", routes);

app.listen(port, () => {
  console.log(`Anteraja app listening on port ${port}`);
});
