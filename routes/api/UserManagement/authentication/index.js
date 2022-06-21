const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const format = require("pg-format");
// const sworm = require('sworm')

const config = require("../../../../config/db");
const {
  loginSchema,
  updatePasswordSchema,
} = require("../../../../model/authSchema");
// const verifyToken = require("../../verifyToken");

const router = express.Router();

const UserTable = process.env.MS_USER;

const pool = require("../../../../config/db");

const validateUserInformation = async (user) => {
  try {
    // const db = sworm.db(config);
    const { username, password } = user;
    pool.connect(function (err, client, done) {
      if (err) throw new Error(err);
      //   var query = format(
      //     `SELECT id,password FROM ${UserTable} WHERE USERNAME='${username}'`
      //   );
      var query = format(`SELECT * FROM ${UserTable}`);
      client.query(query, function (err, res) {
        if (err) {
          console.log(err, "asd");
        }
        console.log(res.rows[0]);
      });
      done();
    });
    // const record = await db.query();

    // if (record.length > 0) {
    //   if (!bcrypt.compareSync(password, record[0].password)) {
    //     return { status: false, message: "Wrong Password" }; // Will return true/false
    //   } else {
    //     delete record[0].password;
    //     return { status: true, data: record[0] };
    //   }
    // }
    // if (record.length == 0) {
    //   return { status: false, message: "Not a user" };
    // }
    // return { status: false, message: "Not a unique username" };
  } catch (err) {
    console.log("Error in validateUserInformation");
    // console.log(err);
    // return {
    //   status: false,
    //   message: `Error while validating User: ${err.message}`,
    // };
  }
};

// const getUserInformation = async (user) => {
//   const { id } = user;
//   const listController = [];
//   const listDataAccess = [];
//   try {
//     const records = await db.query(`
//             SELECT * FROM ${RolesAssingmentTable} ra
//             JOIN ${RolesTable} mr ON ra.ROLES_ID = mr.ID
//             JOIN ${MenuDTable} md ON mr.MENU_H_ID = md.MENU_H_ID
//             JOIN ${ControllerTable} mc ON md.CONTROLLER_ID = mc.ID
//             WHERE ra.USER_ID=${id} and md.IS_ACTIVE = '1'
//         `);
//
//     for (const record of records) {
//       if (
//         listController.find((el) => el == record.controller_name) == undefined
//       ) {
//         // Remove Duplicate controller_name data
//         listController.push(record.controller_name);
//       }
//       if (listDataAccess.find((el) => el == record.data_access) == undefined) {
//         // Remove Duplicate data_access data
//         listDataAccess.push(record.data_access);
//       }
//     }
//     return { status: true, data: { listController, listDataAccess } };
//   } catch (err) {
//     return { status: false, message: err.message };
//   }
// };

const sendEmail = (emailaddress, token) => {
  const baseUrl = process.env.redirect_url;
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_ACC,
      pass: process.env.EMAIL_PASS,
    },
  });
  const mailOptions = {
    from: process.env.EMAIL_ACC,
    to: emailaddress,
    subject: "MPI Reset Password",
    html: `
        <p>Please ignore this email if you never requested to change password</p>
        
        <p>Your reset password link is : <a href=${
          baseUrl + "/change-password/" + token
        }>Reset password</a>
        This link is only alive for 20 minutes!</p>
        `,
  };
  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.log(err);
      throw new Error(`Error while sending email: ${err.message}`);
    } else {
      console.log(info.response);
    }
  });
};

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    // const userJson = await loginSchema.validateAsync({ username, password });
    const userValid = await validateUserInformation(req.body);
    // if (!userValid.status) {
    //   return res
    //     .status(401)
    //     .json({ status: false, message: userValid.message });
    // }
    // const userData = await getUserInformation(userValid.data);
    // if (userData.status) {
    // const token = jwt.sign({ username }, process.env.PRIVATE_KEY, {
    //   expiresIn: "1h",
    // });
    // return res
    //   .status(200)
    //   .cookie("token", token, {
    //     httpOnly: true,
    //     maxAge: 3600000,
    //   })
    //   .json({ status: true, data: { username, ...userValid.data } });
    // res.cookie('token', token, {
    //     httpOnly: true,
    //     maxAge: 3600000
    // });
    // res.cookie('role', JSON.stringify(userData));
    // return res.json({ status: true, message: "Success login" });
    // } else {
    //   return res.status(500).json({ userData });
    // }
  } catch (err) {
    console.log(err);
    // if (err.isJoi == true) {
    //   // Check if contain password regex , change message
    //   err.status = 422;
    //   return res
    //     .status(err.status)
    //     .json({ status: false, message: err.details[0].message });
    // } else {
    //   return res.status(500).json({ status: false, message: err.message });
    // }
  }
});

router.post("/logout", (req, res) => {
  try {
    res.clearCookie("role");
    res.clearCookie("token");
    return res.json({ status: true, message: "Logged Out!" });
  } catch (err) {
    console.log(err);
    return res.status(403).json({ status: false, message: err.message });
  }
});

router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res
      .status(400)
      .json({ status: false, message: "No email attached" });
  }
  try {
    // const db = sworm.db(config);
    const record = await db.query(
      `SELECT * FROM ${UserTable} WHERE email = @email`,
      {
        email: email.toLowerCase(),
      }
    );

    // console.log(record[0])
    if (record.length > 0) {
      console.log(record[0].id);
      const userToken = jwt.sign(
        { id: record[0].id },
        process.env.PRIVATE_KEY_FORGET_PASS,
        { expiresIn: "20m" }
      );
      console.log(userToken);
      sendEmail(record[0].email, userToken);
    }
    return res.json({ status: true, message: "Email is being sent!" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ status: false, message: err.message });
  }
});

router.post("/validate-forgot", async (req, res) => {
  const { token } = req.body;
  if (!token) {
    return res
      .status(404)
      .json({ status: false, message: "No token attached!" });
  } else {
    try {
      const user_id = jwt.verify(token, process.env.PRIVATE_KEY_FORGET_PASS);
      console.log(user_id);
      return res.json({ status: true, data: user_id });
    } catch (err) {
      return res.status(401).json({ status: false, message: "Token Expired" });
    }
  }
});

router.post("/change-password", async (req, res) => {
  const { id, password, confirm_password, updated_by, updated_date } = req.body;
  let validatedNewPassword;
  try {
    validatedNewPassword = await updatePasswordSchema.validateAsync({
      id,
      password,
      confirm_password,
      updated_by,
      updated_date,
    });
  } catch (err) {
    if (err.isJoi == true) {
      err.status = 422;
      return res
        .status(err.status)
        .json({ status: false, message: err.details[0].message });
    }
  }

  try {
    const db = sworm.db(config);
    const userModel = db.model({ table: UserTable });
    const hashedPassword = bcrypt.hashSync(
      validatedNewPassword.password,
      Number(process.env.saltRounds)
    );
    const updateUserPassword = userModel({
      id: validatedNewPassword.id,
      password: hashedPassword,
      updated_by: validatedNewPassword.updated_by,
      updated_date: validatedNewPassword.updated_date,
    });
    await updateUserPassword.update();

    return res.json({ status: true, message: "Change password success!" });
  } catch (err) {
    return res.status(500).json({ status: false, message: err.message });
  }
});

module.exports = router;
