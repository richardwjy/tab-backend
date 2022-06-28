const router = require('express').Router();
const basicAuth = require('./verifyUser');
const moment = require("moment");
const buildQuery = require("../../services/queryBuilder");

const pool = require("../../config/db");

const {
    createBonSementaraSchema,
    updateBonSementaraSchema
} = require("../../model/bonSementaraSchema");

const bonSementaraTable = process.env.TRX_BON_SEMENTARA;

router.get('/auth', basicAuth, async (req, res) => {
    console.log(req.user);
    return res.json({ msg: 'Oke' });
})

router.post('/create-bon', basicAuth, async (req, res) => {
    const data = req.body;
    let validatedData;
    try {
        validatedData = await createBonSementaraSchema.validateAsync({
            position_id: data.position_id,
            tipe_transaksi: data.tipe_transaksi,
            tipe_pembayaran: data.tipe_pembayaran,
            subsidiary: data.subsidiary,
            region: data.region,
            lokasi: data.lokasi,
            tanggal_transaksi: data.tanggal_transaksi,
            nik_pemohon: data.nik_pemohon,
            nama_pemohon: data.nama_pemohon,
            jumlah: data.jumlah,
            penerima_pembayaran: data.payee,
            nama_penerima_pembayaran: data.payee_name,
            alamat_penerima_pembayaran: data.payee_address,
            bank_penerima_pembayaran: data.bank_payee,
            no_rekening_penerima_pembayaran: data.no_rekening_payee,
            atas_nama_penerima_pembayaran: data.atas_nama_payee,
            created_by: "test",
            //created_by: req.user.username,
            created_date: moment().format(),
        });
    }
    catch (err) {
        if (err.isJoi == true) {
            err.status = 422;
            return res
                .status(err.status)
                .json({ status: false, message: err.details[0].message });
        }
    }
    try {
        const client = await pool.connect();
        const query = {
            text: `
            INSERT INTO ${bonSementaraTable} (position_id, tipe_transaksi, tipe_pembayaran, subsidiary, region, lokasi, tanggal_transaksi, nik_pemohon, nama_pemohon, jumlah, penerima_pembayaran, nama_penerima_pembayaran, alamat_penerima_pembayaran, bank_penerima_pembayaran, no_rekening_penerima_pembayaran, atas_nama_penerima_pembayaran, created_by, created_date)
            VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18) RETURNING id
            `,
            values: [
                position_id,
                tipe_transaksi,
                tipe_pembayaran,
                subsidiary,
                region,
                lokasi,
                tanggal_transaksi,
                nik_pemohon,
                nama_pemohon,
                jumlah,
                penerima_pembayaran,
                nama_penerima_pembayaran,
                alamat_penerima_pembayaran,
                bank_penerima_pembayaran,
                no_rekening_penerima_pembayaran,
                atas_nama_penerima_pembayaran,
                created_by,
                created_date,
            ]
        }
        const result = await client.query(query);
        const newBonSementara = result.rows[0];

        return res.json({ status: true, data: newBonSementara, message: "Bon sementara created successfully" });
    }
    catch (err) {
        return res.status(500).json({ status: false, message: err.message });
    }
})

router.put('/update-bon', basicAuth, async (req, res) => {
    const data = req.body;
    let validatedData;
    try {
        validatedData = await updateBonSementaraSchema.validateAsync({
            id: data.id,
            jumlah: data.jumlah,
            keterangan: data.keterangan,
            penerima_pembayaran: data.penerima_pembayaran,
            nama_penerima_pembayaran: data.nama_penerima_pembayaran,
            alamat_penerima_pembayaran: data.alamat_penerima_pembayaran,
            bank_penerima_pembayaran: data.bank_penerima_pembayaran,
            no_rekening_penerima_pembayaran: data.no_rekening_penerima_pembayaran,
            atas_nama_penerima_pembayaran: data.atas_nama_penerima_pembayaran,
            akun_bank_regional: data.akun_bank_regional,
            coa_bon_sementara: data.coa_bon_sementara,
            updated_by: "test",
            //updated_by: req.user.username,
            updated_date: moment().format(),
        });
    }
    catch (err) {
        if (err.isJoi == true) {
            err.status = 422;
            return res
                .status(err.status)
                .json({ status: false, message: err.details[0].message });
        }
    }
    try {
        const client = await pool.connect();
        const { query, status } = buildQuery("UPDATE_BYID", {
            cols: validatedData,
            table: bonSementaraTable,
        });

        if (!status) {
            return res.status(422).json({ status });
        }

        const result = await client.query(query);
        const updatedBonSementara = result.rows[0];
        return res.json({ status: true, data: updatedBonSementara, message: "Bon sementara updated successfully" });
    }
    catch (err) {
        return res.status(500).json({ status: false, message: err.message });
    }
})

module.exports = router;