const router = require("express").Router();
const moment = require("moment");
const { netsuiteGet } = require("../../../services/netsuite");

const pool = require("../../../config/db");

function queryBuilderBonSementara(attribute, query) {

}

router.get('/tipe-transaksi', async (req, res) => {
    const tipeTransaksi = [
        "Karyawan",
        "Vendor",
    ];
    return res.json({ status: true, data: tipeTransaksi });
})

router.get('/tipe-pembayaran', async (req, res) => {
    const tipePembayaran = [
        "Cash",
        "Transfer",
    ];
    return res.json({ status: true, data: tipePembayaran });
})

router.get('/subsidiary', async (req, res) => {

})

router.get('/lokasi', async (req, res) => {

})

router.get('/regional', async (req, res) => {

})

router.get('/nik-pemohon', async (req, res) => {
    try {
        const { data } = await netsuiteGet({ script: '320', deploy: '1' });
        const result = [];
        data.forEach(el => {
            result.push({
                nik: el.nik,
                nama: el.employee_name,
            })
        });
        return res.json(result);
    } catch (err) {
        console.log(err.response);
        console.log(err.message);
        return res.send("Error!");
    }
})

module.exports = router;