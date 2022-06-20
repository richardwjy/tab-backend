const router = require("express").Router();
const { axiosGet, axiosPost } = require("../../services/axios");
const { Client } = require('pg');

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

router.get('/how-to-connect-psql', async (req, res) => {
    // Notes Richard (20-June-2022)
    // Silahkan di enchance jika mau, contoh enhancement: membuat services yang hanya return data/error instead of code panjang begini.
    // Jika memang pengen dipindah jadi service, pikirin semua scenario termasuk kluarin ID ketika insert data dll
    try {
        const client = new Client();
        client.connect();
        client.query(`SELECT * FROM MS_USERS ORDER BY id ASC`, (error, results) => {
            if (error) {
                console.error(error);
                return res.status(200).json({ status: false, message: error })
            }
            client.end();
            return res.status(200).json(results.rows);
        })
    } catch (err) {
        console.error(err);
        return res.status(200).json({ status: false, message: err })
    }
})

module.exports = router;