const router = require("express").Router();
const verifyToken = require("../../verifyToken");

const sworm = require("sworm");
const config = require("../../../../config/db");
const {
  newRoleAssignSchema,
  updateRoleAssignSchema,
} = require("../../../../model/roleAssignSchema");

const RolesAssignmentTable = process.env.ROLES_ASSIGNMENT;
const UsersTable = process.env.MS_USER;
const RolesTable = process.env.MS_ROLES;

router.use(verifyToken);

router.get("/", async (req, res) => {
  try {
    const db = sworm.db(config);
    const records = await db.query(`
            SELECT mra.*,mu.username,mr.roles_name FROM ${RolesAssignmentTable} mra
            JOIN ${UsersTable} mu ON mra.user_id = mu.id
            JOIN ${RolesTable} mr ON mra.roles_id = mr.id
        `);
    // console.log(records)
    await db.close();
    return res.json({ status: true, data: records, rowCount: records.length });
  } catch (err) {
    console.log(err);
    return res.json({ status: false, message: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const db = sworm.db(config);
    const rolesAssignId = Number(req.params["id"]);
    const record = await db.query(`
            SELECT mra.*,mu.username,mr.roles_name FROM ${RolesAssignmentTable} mra
            JOIN ${UsersTable} mu ON mra.user_id = mu.id
            JOIN ${RolesTable} mr ON mra.roles_id = mr.id 
            WHERE mra.id=${rolesAssignId}
        `);
    // console.log(record)
    // const position = positions.find((pos_obj) => pos_obj.id === position_id_search)
    await db.close();
    return record !== undefined
      ? res.status(200).json({ status: true, data: record })
      : res.status(404).json({
          status: false,
          message: `No Roles data id: ${rolesAssignId}`,
        });
  } catch (err) {
    console.log(err);
    return res.json({ status: false, message: err.message });
  }
});

router.post("/", async (req, res) => {
  let validatedRoleAssign;
  try {
    validatedRoleAssign = await newRoleAssignSchema.validateAsync(req.body);
  } catch (err) {
    console.log(err);
    return res
      .status(422)
      .json({ status: false, message: err.details[0].message });
  }

  try {
    const db = sworm.db(config);
    const rolesAssign = db.model({ table: RolesAssignmentTable });
    const newRolesAssign = rolesAssign(validatedRoleAssign);
    await newRolesAssign.insert();
    await db.close();

    return res.json({ status: true, data: newRolesAssign });
  } catch (err) {
    console.log(err);
    return res.json({ status: false, message: err.message });
  }
});

router.put("/", async (req, res) => {
  let validatedUpdateRoleAssign;
  const roleAssignJson = req.body;
  const db = sworm.db(config);
  try {
    const roleAssign = await db.query(`
    SELECT start_date, end_date
    FROM ${RolesAssignmentTable}
    WHERE id=${roleAssignJson.id}`);

    //Tambah start date ke body jika di body tidak ada
    if (!roleAssignJson.start_date) {
      roleAssignJson.start_date = roleAssign[0].start_date;
    }
    //Tambah end date ke body jika body tidak ada
    if (!roleAssignJson.end_date && roleAssign[0].end_date) {
      roleAssignJson.end_date = roleAssign[0].end_date;
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      status: false,
      message:
        err.message ||
        `Internal database error while saving to ${RolesAssignmentTable}`,
    });
  }
  try {
    validatedUpdateRoleAssign = await updateRoleAssignSchema.validateAsync(
      roleAssignJson
    );
  } catch (err) {
    console.log(err);
    return res
      .status(422)
      .json({ status: false, message: err.details[0].message });
  }

  try {
    const rolesAssign = db.model({ table: RolesAssignmentTable });
    const updatedRolesAssign = rolesAssign(validatedUpdateRoleAssign);
    await updatedRolesAssign.update();
    await db.close();

    return res.json({ status: true, data: updatedRolesAssign });
  } catch (err) {
    console.log(err);
    return res.json({ status: false, message: err.message });
  }
});

module.exports = router;
