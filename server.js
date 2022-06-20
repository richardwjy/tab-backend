const express = require('express')
const dotnev = require('dotenv')
dotnev.config()
const app = express()
const port = 3000

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Anteraja app listening on port ${port}`)
})