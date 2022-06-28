const router = require("express").Router();
const verifyToken = require("../../verifyToken");

const sworm = require("sworm");
const config = require("../../../../config/db");
const {
  newRolesSchema,
  updateRolesSchema,
} = require("../../../../model/roleSchema");

const RolesTable = process.env.MS_ROLES;
const MenuHeaderTable = process.env.MS_HEADER;

router.use(verifyToken);

router.get("/", async (req, res) => {
  try {
    const db = sworm.db(config);
    const records = await db.query(`
            SELECT mr.*,mh.menu_name FROM ${RolesTable} mr
            JOIN ${MenuHeaderTable} mh ON mr.MENU_H_ID = mh.ID 
        `);
    // console.log(records)
    await db.close();
    return res.json({ status: true, data: records, rowCount: records.length });
  } catch (err) {
    console.log(err);
    return res.json({
      status: false,
      message:
        err.message || `Internal database error while saving to ${RolesTable}`,
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const db = sworm.db(config);
    const roleId = Number(req.params["id"]);
    const record = await db.query(`
            SELECT mr.* FROM ${RolesTable} mr
            JOIN ${MenuHeaderTable} mh ON mr.MENU_H_ID = mh.ID 
            WHERE mr.id=${roleId}
        `);
    // console.log(record)
    // const position = positions.find((pos_obj) => pos_obj.id === position_id_search)
    await db.close();
    return record !== undefined
      ? res.status(200).json({ status: true, data: record })
      : res
          .status(404)
          .json({ status: false, message: `No role data id: ${rolesId}` });
  } catch (err) {
    console.log(err);
    return res.json({
      status: false,
      message:
        err.message || `Internal database error while saving to ${RolesTable}`,
    });
  }
});

router.post("/", async (req, res) => {
  // Joi Validate newRolesSchema
  let validatedNewRole;
  try {
    validatedNewRole = await newRolesSchema.validateAsync(req.body);
  } catch (err) {
    return res
      .status(422)
      .json({ status: false, message: err.details[0].message });
  }
  try {
    const db = sworm.db(config);
    const roles = db.model({ table: RolesTable });
    const newRoles = roles(validatedNewRole);
    await newRoles.insert();
    await db.close();
    return res.json({ status: true, data: newRoles });
  } catch (err) {
    console.log(err);
    return res.json({
      status: false,
      message:
        err.message || `Internal database error while saving to ${RolesTable}`,
    });
  }
});

router.put("/", async (req, res) => {
  // Joi Validate updateRolesSchema
  let validatedUpdateRole;
  const roleJson = req.body;
  const db = sworm.db(config);
  try {
    const role = await db.query(`
    SELECT start_date, end_date
    FROM ${RolesTable}
    WHERE id=${roleJson.id}`);

    //Tambah start date ke body jika di body tidak ada
    if (!roleJson.start_date) {
      roleJson.start_date = role[0].start_date;
    }
    //Tambah end date ke body jika body tidak ada
    if (!roleJson.end_date && role[0].end_date) {
      roleJson.end_date = role[0].end_date;
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      status: false,
      message:
        err.message || `Internal database error while saving to ${RolesTable}`,
    });
  }
  try {
    validatedUpdateRole = await updateRolesSchema.validateAsync(roleJson);
  } catch (err) {
    return res
      .status(422)
      .json({ status: false, message: err.details[0].message });
  }
  try {
    const roles = db.model({ table: RolesTable });
    const updatedRole = roles(validatedUpdateRole);
    await updatedRole.update();
    await db.close();
    return res.json({ status: true, data: updatedRole });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      status: false,
      message:
        err.message || `Internal database error while saving to ${RolesTable}`,
    });
  }
});

module.exports = router;
