const router = require("express").Router();
const OAuth = require("../../services/oauth");
const { netsuiteGet } = require("../../services/netsuite");
const { Client } = require("pg");
const buildQuery = require("../../services/queryBuilder");

router.get("/generate-oauth", async (req, res) => {
  // Silahkan diisi query parameters
  // http://localhost:5000/v1/api/tutorial/generate-oauth?script=323&deploy=1
  const { query } = req;
  const stringified = JSON.stringify({
    token: OAuth({ ...query, httpmethod: req.method }),
  });
  console.log(JSON.parse(stringified));
  return res.json({ token: stringified });
});

router.get("/how-to-get", async (req, res) => {
  // http://localhost:5000/v1/api/tutorial/how-to-get
  const { query } = req;
  try {
    const { data } = await netsuiteGet({ ...query });
    return res.json(data);
  } catch (err) {
    console.log(err.response);
    console.log(err.message);
    return res.send("Error!");
  }
});

// router.post('/how-to-post', async (req, res) => {
//     // http://localhost:5000/v1/api/tutorial/how-to-post
//     try {
//         const { data } = await axiosPost({ params: { script: 323, deploy: 1 }, body: { someJsonString: "Hati hati di jalan!", someJsonId: 22, someJsonBoolean: true } })
//         return res.json(data);
//     } catch (err) {
//         // console.error(err);
//         console.log(err.message);
//         console.log(err.response);
//         return res.send("Error!");
//     }
// })

router.get("/how-to-connect-psql", async (req, res) => {
  // http://localhost:5000/v1/api/tutorial/how-to-connect-psql

  // Notes Richard (20-June-2022)
  // Silahkan di enchance jika mau, contoh enhancement: membuat services yang hanya return data/error instead of code panjang begini.
  // Jika memang pengen dipindah jadi service, pikirin semua scenario termasuk kluarin ID ketika insert data dll
  try {
    const client = new Client();
    client.connect();
    client.query(`SELECT * FROM MS_USERS ORDER BY id ASC`, (error, results) => {
      if (error) {
        console.error(error);
        return res.status(200).json({ status: false, message: error });
      }
      client.end();
      return res.status(200).json(results.rows);
    });
  } catch (err) {
    console.error(err);
    return res.status(200).json({ status: false, message: err });
  }
});

// Query Builder Update By ID buat PG : pake services hanya return query dan status
router.get("/update-query", async (req, res) => {
  try {
    const { query, status } = buildQuery("UPDATE_BYID", {
      cols: {
        id: 1,
        name: "eric",
      },
      table: "name",
    });

    if (!status) {
      return res.status(422).json({ status });
    }

    return res.status(200).json(query);
    // const client = new Client();
    // client.connect();
    // client.query(`SELECT * FROM MS_USERS ORDER BY id ASC`, (error, results) => {
    //     if (error) {
    //         console.error(error);
    //         return res.status(200).json({ status: false, message: error })
    //     }
    //     client.end();
    //     return res.status(200).json(results.rows);
    // })
  } catch (err) {
    // console.error(err);
    // return res.status(200).json({ status: false, message: err })
  }
});

router.get("/select-query", async (req, res) => {
  try {
    const { query, status } = buildQuery("SELECT", {
      filter: {
        id: 1,
      },
      table: "name",
    });

    if (!status) {
      return res.status(422).json({ status });
    }

    return res.status(200).json(query);
    // const client = new Client();
    // client.connect();
    // client.query(`SELECT * FROM MS_USERS ORDER BY id ASC`, (error, results) => {
    //     if (error) {
    //         console.error(error);
    //         return res.status(200).json({ status: false, message: error })
    //     }
    //     client.end();
    //     return res.status(200).json(results.rows);
    // })
  } catch (err) {
    // console.error(err);
    // return res.status(200).json({ status: false, message: err })
  }
});

module.exports = router;
