const Joi = require("joi");

const createBonSementaraSchema = Joi.object({
    position_id: Joi.number().required(),
    tipe_transaksi: Joi.string().max(20).required(),
    tipe_pembayaran: Joi.string().max(20).required(),
    subsidiary: Joi.string().max(255).required(),
    region: Joi.string().max(255).required(),
    lokasi: Joi.string().max(255).required(),
    tanggal_transaksi: Joi.date().required(),
    nik_pemohon: Joi.string().max(255).required(),
    nama_pemohon: Joi.string().max(255).required(),
    jumlah: Joi.number().required(),
    penerima_pembayaran: Joi.string().max(255).required(),
    nama_penerima_pembayaran: Joi.string().max(255).required(),
    alamat_penerima_pembayaran: Joi.string().max(255).required(),
    bank_penerima_pembayaran: Joi.string().max(255).required(),
    no_rekening_penerima_pembayaran: Joi.string().max(255).required(),
    atas_nama_penerima_pembayaran: Joi.string().max(255).required(),
    created_by: Joi.string().required(),
    created_date: Joi.date().required()
});

const updateBonSementaraSchema = Joi.object({
    id: Joi.number().required(),
    jumlah: Joi.number().required(),
    keterangan: Joi.string().max(255).required(),
    penerima_pembayaran: Joi.string().max(255).required(),
    nama_penerima_pembayaran: Joi.string().max(255).required(),
    alamat_penerima_pembayaran: Joi.string().max(255).required(),
    bank_penerima_pembayaran: Joi.string().max(255).required(),
    no_rekening_penerima_pembayaran: Joi.string().max(255).required(),
    atas_nama_penerima_pembayaran: Joi.string().max(255).required(),
    akun_bank_regional: Joi.string().max(255).required(),
    coa_bon_sementara: Joi.string().max(255).required(),
    updated_by: Joi.string().required(),
    updated_date: Joi.date().required()
});

module.exports = { createBonSementaraSchema, updateBonSementaraSchema };
