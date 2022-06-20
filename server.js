const dotnev = require('dotenv')
dotnev.config()

const express = require('express')
const app = express()
const PORT = 5000

const route = require("./routes/routes");

app.use(express.json());
app.use('/v1/api', route);

app.listen(PORT, () => {
    console.log(`Anteraja app listening on port ${PORT}`)
})