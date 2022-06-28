const router = require("express").Router();
const verifyToken = require("../../verifyToken");
const {
  newPositionSchema,
  updatePositionSchema,
} = require("../../../../model/positionSchema");

const pool = require("../../../../config/db");

const buildQuery = require("../../../../services/queryBuilder");
const PositionTable = process.env.MS_POSITION;

// router.use(verifyToken);

router.get("/", async (req, res) => {
  try {
    const client = await pool.connect();
    const { status, query } = buildQuery("SELECT", {
      table: PositionTable,
    });
    console.log(query);
    if (!status) {
      return {
        status: false,
        message: "Your Missing Parameter in Query Builder",
      };
    }
    const result = await client.query(query);
    client.release();
    const records = result.rows;
    return res.json({ status: true, data: records, rowCount: records.length });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      status: false,
      message: err.message || "Internal database error",
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const position_id_search = Number(req.params["id"]);
    const client = await pool.connect();
    const { status, query } = buildQuery("SELECT", {
      table: PositionTable,
      filter: {
        id: position_id_search,
      },
    });

    if (!status) {
      return {
        status: false,
        message: "Your Missing Parameter in Query Builder",
      };
    }
    const result = await client.query(query, [position_id_search]);
    client.release();
    const record = result.rows;

    // console.log(record)
    // const position = positions.find((pos_obj) => pos_obj.id === position_id_search)

    return record !== undefined
      ? res.status(200).json({ status: true, data: record })
      : res.status(404).json({
          status: false,
          message: `No position data id: ${position_id_search}`,
        });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      status: false,
      message: err.message || "Internal database error",
    });
  }
});

router.post("/", async (req, res) => {
  try {
    const client = await pool.connect();
    const validatedNewPosition = await newPositionSchema.validateAsync(
      req.body
    );
    try {
      const { query, status } = buildQuery("INSERT", {
        cols: {
          ...validatedNewPosition,
        },
        table: PositionTable,
      });
      var params = Object.keys(validatedNewPosition).map(function (key) {
        return validatedNewPosition[key];
      });
      // console.log(query, params);
      let result = await client.query(query, params);
      const newPosition = result.rows[0];
      return res.json({ status: true, data: newPosition });
    } catch (err) {
      console.log("Error save");
      console.log(err);
      return res.status(500).json({
        status: false,
        message: err.message || "Internal database error while saving",
      });
    }
    // const maxId = positions[positions.length - 1].id + 1
    // const newPosition = { id: maxId, ...validatedNewPosition }
    // positions.push(newPosition)
    // return res.status(200).json({ newPosition })
  } catch (err) {
    if (err.isJoi == true) {
      err.status = 422;
      return res
        .status(err.status)
        .json({ status: false, message: err.details[0].message });
    } else {
      return res.status(500).json({
        status: false,
        message:
          err.message || "Internal database error while posting position data",
      });
    }
  }
});

router.put("/", async (req, res) => {
  try {
    const positionJson = req.body;
    const client = await pool.connect();
    // const position = await db.query(`
    //         SELECT start_date, end_date
    //         FROM ${PositionTable}
    //         WHERE id=${positionJson.id}
    //     `);

    let { status, query } = buildQuery("SELECT", {
      table: PositionTable,
      filter: {
        id: positionJson.id,
      },
    });

    if (!status) {
      return {
        status: false,
        message: "Your Missing Parameter in Query Builder",
      };
    }

    let result = await client.query(query, [positionJson.id]);
    const position = result.rows;
    console.log(position);
    //Tambah start date ke body jika di body tidak ada
    if (!positionJson.start_date) {
      positionJson.start_date = position[0].start_date;
    }
    //Tambah end date ke body jika body tidak ada
    if (!positionJson.end_date && position[0].end_date) {
      positionJson.end_date = position[0].end_date;
    }
    const validatedUpdatedPosition = await updatePositionSchema.validateAsync(
      positionJson
    );
    // const positions = db.model({ table: PositionTable });
    ({ status, query } = buildQuery("UPDATE_BYID", {
      cols: {
        ...validatedUpdatedPosition,
      },
      table: PositionTable,
    }));
    var params = Object.keys(validatedUpdatedPosition).map(function (key) {
      return validatedUpdatedPosition[key];
    });
    // console.log(query, params);
    result = await client.query(query, params);
    const updatedPosition = result.rows[0];
    client.release();
    return res.json({ status: true, data: updatedPosition });
  } catch (err) {
    if (err.isJoi == true) {
      err.status = 422;
      return res
        .status(err.status)
        .json({ status: false, message: err.details[0].message });
    }
    console.log(err);
    return res.status(500).json({
      status: false,
      message:
        err.message || "Internal database error while updating position data",
    });
  }
});

module.exports = router;
