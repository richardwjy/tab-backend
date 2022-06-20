const express = require('express')
const dotnev = require('dotenv')
dotnev.config()

const OAuth = require('./services/oauth');
const app = express()
const PORT = 5000

app.use(express.json());

app.get('/', (req, res) => {
    console.log({ token: OAuth({ script: 323, deploy: 1, httpmethod: "GET" }) });
    return res.json({ token: OAuth({ script: 323, deploy: 1, httpmethod: "GET" }) });
})

app.listen(PORT, () => {
    console.log(`Anteraja app listening on port ${PORT}`)
})