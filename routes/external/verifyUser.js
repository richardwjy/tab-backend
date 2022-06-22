const pool = require("../../config/db");
const bcrypt = require("bcryptjs");

const UserTable = process.env.MS_USER;

module.exports = async (req, res, next) => {
    try {
        // Step 1 - Get User Basic Auth username:password
        if (!req.headers.authorization || req.headers.authorization.indexOf('Basic ') === -1) {
            return res.status(401).json({ message: 'Missing Authorization Header' });
        }
        const base64Credentials = req.headers.authorization.split(' ')[1];
        const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
        const [username, password] = credentials.split(':');

        // Step 2 - Start Checking user credentials in Database
        const client = await pool.connect();
        const query = {
            text: `SELECT * FROM ${UserTable} where username = $1`,
            values: [username],
        };
        const { rows } = await client.query(query);
        client.release();
        if (rows.length > 0) {
            if (!bcrypt.compareSync(password, rows[0].password)) {
                return res.status(401).json({ message: "Invalid Password" });
            } else {
                delete rows[0].password;
                req.user = rows[0];
                return next();
            }
        }
        if (rows.length == 0) {
            return res.status(401).json({ message: "Not a user" });
        }
        return res.json({ message: "Not a unique username" });
    } catch (err) {
        console.log("Error in validateUserInformation");
        console.log(err);
        return res.status(500).json({ message: `Error while validating User: ${err.message}` });
    }
};