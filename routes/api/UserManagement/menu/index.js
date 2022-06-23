const router = require("express").Router();
const verifyToken = require("../../verifyToken");
const config = require("../../../../config/db");
const {
  newMenuSchema,
  updateMenuSchema,
} = require("../../../../model/menuSchema");
const pool = require("../../../../config/db");

const MenuHeaderTable = process.env.ms_header;
const MenuDetailTable = process.env.ms_detail;

const FormTable = process.env.ms_form;
const ControllerTable = process.env.ms_controller;
// router.use(verifyToken);

const getListHeaderId = (headers) => {
  let listId = [];
  headers.forEach((obj) => {
    listId.push(obj.id);
  });
  return listId.join(",");
};

function updateTablebyId(table, id, cols, where) {
  // Setup static beginning of query
  var query = [`UPDATE ${table}`];
  query.push("SET");

  // Create another array storing each set command
  // and assigning a number value for parameterized query
  //   console.log(cols);
  var set = [];
  Object.keys(cols).forEach(function (key, i) {
    set.push(key + " = ($" + (i + 1) + ")");
  });
  query.push(set.join(", "));

  // Add the WHERE statement to look up by id
  query.push(`WHERE ${where} = ` + id);

  //Add the Returnin Statement
  query.push(`RETURNING *`);
  // Return a complete query string
  return query.join(" ");
}

router.get("/header", async (req, res) => {
  try {
    const client = await pool.connect();
    let query = {
      text: `SELECT mh.*,mf.form_name FROM ${MenuHeaderTable} mh 
      JOIN ${FormTable} mf ON mh.FORM_ID = mf.ID`,
    };
    let result = await client.query(query);
    // console.log(result.rows);
    const headerRecords = result.rows;
    const listHeaderId = getListHeaderId(headerRecords);
    console.log(listHeaderId);

    query = {
      text: `SELECT md.*,mc.controller_name FROM ${MenuDetailTable} md
        JOIN ${ControllerTable} mc ON md.controller_id = mc.id
        WHERE md.MENU_H_ID IN ($1)`,
      values: [listHeaderId],
    };

    result = await client.query(query);
    const detailRecords = result.rows;

    console.log(detailRecords);
    headerRecords.map((headerObj) => {
      headerObj.menu_details = detailRecords.filter(
        (detailObj) => Number(detailObj.menu_h_id) == Number(headerObj.id)
      );
    });
    await client.release();
    return headerRecords.length > 0
      ? res.json({
          status: true,
          data: headerRecords,
          rowCount: headerRecords.length,
        })
      : res.json({ status: false, message: "No data on table Header" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      status: false,
      message: err.message || "Internal database error",
    });
  }
});

router.get("/header/:header_id", async (req, res) => {
  try {
    const header_id = req.params["header_id"];

    const client = await pool.connect();
    const query = {
      text: `SELECT mh.*, mf.form_name FROM ${MenuHeaderTable} mh 
      JOIN ${FormTable} mf ON mh.FORM_ID = mf.ID 
      WHERE mh.ID = $1`,
      values: [header_id],
    };
    const result = await client.query(query);
    client.release();
    const records = result.rows;
    console.log(records);
    return records.length > 0
      ? res.json({ status: true, data: records, rowCount: records.length })
      : res.json({ status: false, message: "No data on table Header" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      status: false,
      message: err.message || "Internal database error",
    });
  }
});

router.get("/detail/:header_id", async (req, res) => {
  const header_id = req.params["header_id"];
  try {
    const client = await pool.connect();
    const query = {
      text: `SELECT md.*,mc.controller_name FROM ${MenuDetailTable} md 
      JOIN ${ControllerTable} mc ON md.CONTROLLER_ID = mc.ID 
      WHERE MENU_H_ID=$1`,
      values: [header_id],
    };
    const result = await client.query(query);
    client.release();
    const records = result.rows;
    // console.log(records)
    return records.length > 0
      ? res.json({ status: true, data: records, rowCount: records.length })
      : res.json({ status: false, message: "No data on table Header" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      status: false,
      message: err.message || "Internal database error",
    });
  }
});

router.post("/", async (req, res) => {
  const menuHeaderJson = req.body;
  const menuDetailJson = req.body.menu_details;
  menuDetailJson.forEach((obj) => {
    delete obj.controller_name;
  });
  menuHeaderJson.menu_details = menuDetailJson;
  let validatedNewMenu;
  try {
    validatedNewMenu = await newMenuSchema.validateAsync(menuHeaderJson);
  } catch (err) {
    console.log(err);
    return res
      .status(422)
      .json({ status: false, message: err.details[0].message });
  }

  // Save to database
  try {
    const client = await pool.connect();

    let query = {
      text: `INSERT INTO ${MenuHeaderTable} (menu_name, form_id, description,start_date,end_date,created_by,created_date,updated_by,updated_date) 
        VALUES($1, $2, $3, $4,$5,$6,$7,$8,$9) RETURNING id`,
      values: [
        validatedNewMenu.menu_name,
        validatedNewMenu.form_id,
        validatedNewMenu.description,
        validatedNewMenu.start_date,
        validatedNewMenu.end_date,
        validatedNewMenu.created_by,
        validatedNewMenu.created_date,
        validatedNewMenu.updated_by,
        validatedNewMenu.updated_date,
      ],
    };
    let result = await client.query(query);
    const newMenuHeader = result.rows[0];
    // console.log(newMenuHeader);

    const newMenuDetail = await Promise.all(
      validatedNewMenu.menu_details.map(async (detailObj) => {
        let query = {
          text: `INSERT INTO ${MenuDetailTable} (menu_h_id, controller_id, created_by, created_date, updated_by, updated_date, is_active) 
              VALUES($1, $2, $3, $4,$5,$6,$7) RETURNING id`,
          values: [
            newMenuHeader.id,
            detailObj.controller_id,
            detailObj.created_by,
            detailObj.created_date,
            detailObj.updated_by,
            detailObj.updated_date,
            detailObj.is_active,
          ],
        };

        result = await client.query(query);
        newDetail = result.rows[0];
        return { ...detailObj, id: newDetail.id };
      })
    );
    client.release();
    return res.json({
      status: true,
      data: { ...newMenuHeader, menu_details: [...newMenuDetail] },
    });
  } catch (err) {
    // console.log(err)
    return res.json({
      status: false,
      message: err.message || "Internal database error while posting menu data",
    });
  }
});

router.put("/", async (req, res) => {
  let validatedUpdateMenu;
  const menuHeaderJson = req.body;
  const menuDetailJson = req.body.menu_details;
  menuDetailJson.forEach((obj) => {
    delete obj.controller_name;
  });
  menuHeaderJson.menu_details = menuDetailJson;
  const client = await pool.connect();
  try {
    let query = {
      text: `SELECT start_date, end_date
    FROM ${MenuHeaderTable}
    WHERE ID=$1`,
      values: [menuHeaderJson.menu_header_id],
    };
    let result = await client.query(query);
    const menuHeader = result.rows;

    //Tambah start date ke body jika di body tidak ada
    if (!menuHeaderJson.start_date) {
      menuHeaderJson.start_date = menuHeader[0].start_date;
    }
    //Tambah end date ke body jika body tidak ada
    if (!menuHeaderJson.end_date && menuHeader[0].end_date) {
      menuHeaderJson.end_date = menuHeader[0].end_date;
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      status: false,
      message:
        err.message || "Internal database error while updating menu data",
    });
  }

  try {
    validatedUpdateMenu = await updateMenuSchema.validateAsync(menuHeaderJson);
  } catch (err) {
    console.log(err);
    return res
      .status(422)
      .json({ status: false, message: err.details[0].message });
  }

  // Update to database
  try {
    //split menu_details and menu header from validateupdatemenu
    const { menu_details, ...updateHeaderMenu } = validatedUpdateMenu;

    query = updateTablebyId(
      MenuHeaderTable,
      validatedUpdateMenu.id,
      updateHeaderMenu,
      "id"
    );
    var params = Object.keys(updateHeaderMenu).map(function (key) {
      return updateHeaderMenu[key];
    });

    const result = await client.query(query, params);
    const updateMenuHeader = result.rows[0];
    console.log(updateMenuHeader);
    const updateMenuDetail = await Promise.all(
      menu_details.map(async (detailObj) => {
        query = updateTablebyId(MenuDetailTable, detailObj.id, detailObj, "id");
        var params = Object.keys(detailObj).map(function (key) {
          return detailObj[key];
        });
        const result = await client.query(query, params);
        const updateDetail = result.rows[0];
        return { ...detailObj, id: updateDetail.id };
      })
    );

    client.release();
    return res.json({
      status: true,
      data: { ...updateMenuHeader, menu_details: updateMenuDetail },
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      status: false,
      message:
        err.message || "Internal database error while updating menu data",
    });
  }
});

module.exports = router;
