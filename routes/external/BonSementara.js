const router = require('express').Router();
const basicAuth = require('./verifyUser');

router.get('/auth', basicAuth, async (req, res) => {
    console.log(req.user);
    return res.json({ msg: 'Oke' });
})

router.post('/bon', basicAuth, async (req, res) => {
    console.log("Create bon Sementara");
    return res.json({ msg: 'Create bon Sementara' });
})

module.exports = router;