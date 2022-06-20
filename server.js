const express = require('express')
const dotnev = require('dotenv')
dotnev.config()

// const OAuth = require('./services/oauth');
const { axiosGet, axiosPost } = require('./services/axios');
const app = express()
const PORT = 5000

app.use(express.json());

app.get('/how-to-get', async (req, res) => {
    // console.log({ token: OAuth({ script: 323, deploy: 1, httpmethod: "GET" }) });
    // return res.json({ token: OAuth({ script: 323, deploy: 1, httpmethod: "GET" }) });
    try {
        const { data } = await axiosGet({ script: 323, deploy: 1 })
        return res.json(data);
    } catch (err) {
        // console.error(err);
        console.log(err.response);
        return res.send("Error!")
    }
})

app.post('/how-to-post', async (req, res) => {
    // console.log({ token: OAuth({ script: 323, deploy: 1, httpmethod: "GET" }) });
    // return res.json({ token: OAuth({ script: 323, deploy: 1, httpmethod: "GET" }) });
    try {
        const { data } = await axiosPost({ script: 323, deploy: 1 })
        return res.json(data);
    } catch (err) {
        // console.error(err);
        console.log(err.message);
        console.log(err.response);
        return res.send("Error!");
    }
})

app.listen(PORT, () => {
    console.log(`Anteraja app listening on port ${PORT}`)
})