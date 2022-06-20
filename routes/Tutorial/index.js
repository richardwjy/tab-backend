const router = require("express").Router();
const { axiosGet, axiosPost } = require("../../services/axios");

router.get('/how-to-get', async (req, res) => {
    // console.log({ token: OAuth({ script: 323, deploy: 1, httpmethod: "GET" }) });
    // return res.json({ token: OAuth({ script: 323, deploy: 1, httpmethod: "GET" }) });
    try {
        const { data } = await axiosGet({ script: 323, deploy: 1 })
        return res.json(data);
    } catch (err) {
        console.log(err.response);
        console.log(err.message);
        return res.send("Error!")
    }
})

router.post('/how-to-post', async (req, res) => {
    try {
        const { data } = await axiosPost({ params: { script: 323, deploy: 1 }, body: { someJsonString: "Hati hati di jalan!", someJsonId: 22, someJsonBoolean: true } })
        return res.json(data);
    } catch (err) {
        // console.error(err);
        console.log(err.message);
        console.log(err.response);
        return res.send("Error!");
    }
})

module.exports = router;