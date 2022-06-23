const router = require("express").Router();
const verifyToken = require("../../verifyToken");

const FormTable = process.env.ms_form;
const ControllerTable = process.env.ms_controller;
const pool = require("../../../../config/db");

// router.use(verifyToken);

router.get("/form", async (req, res) => {
  try {
    // const db = sworm.db(config);
    const client = await pool.connect();
    const query = {
      text: `SELECT * FROM ${FormTable}`,
    };
    const result = await client.query(query);
    const records = result.rows;
    client.release();
    // console.log(records)
    return records.length > 0
      ? res.json({ status: true, data: records, rowCount: records.length })
      : res.json({ status: false, message: "No data" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      status: false,
      message: `Error Occured while querying to table :${FormTable} | ${err.message}`,
    });
  }
});

router.get("/form/:id/controller", async (req, res) => {
  const search_form_id = Number(req.params["id"]);
  try {
    const client = await pool.connect();
    const query = {
      text: `SELECT * FROM ${ControllerTable} WHERE FORM_ID=$1`,
      values: [search_form_id],
    };
    const result = await client.query(query);
    const records = result.rows;
    client.release();

    // console.log(records)
    return records.length > 0
      ? res.json({ status: true, data: records, rowCount: records.length })
      : res.json({ status: false, message: "No data" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      status: false,
      message: `Error Occured while querying to table :${FormTable} | ${err.message}`,
    });
  }
});

module.exports = router;
