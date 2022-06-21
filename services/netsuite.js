const OAuth = require('./oauth');
const axios = require('axios');

module.exports = {
    netsuiteGet: async (args = {}) => {
        return await axios({
            method: "GET",
            url: process.env.NETSUITE_URL,
            headers: {
                'Authorization': OAuth({ ...args, httpmethod: "GET" }),
                'Content-Type': "application/json"
            },
            params: {
                ...args
            }
        })
    },
    // netsuitePost: async (args = { params: {/* Untuk real parameter */ }, options: {/* Untuk Netsuite */ }, body: {/* Untuk body axios */ } }) => {
    //     return await axios({
    //         method: "POST",
    //         url: process.env.NETSUITE_URL,
    //         headers: {
    //             'Authorization': OAuth({ ...args.options, httpmethod: "POST" }),
    //             'Content-Type': 'application/json'
    //         },
    //         params: {
    //             ...args.params
    //         },
    //         body: {
    //             ...args.body
    //         }
    //     })
    // }
}