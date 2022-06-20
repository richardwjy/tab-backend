const OAuth = require('./oauth');
const axios = require('axios');

module.exports = {
    axiosGet: async (options = {}) => {
        return await axios({
            method: "GET",
            url: process.env.NETSUITE_URL,
            headers: {
                'Authorization': OAuth({ ...options, httpmethod: "GET" }),
                'Content-Type': "application/json"
            },
            params: {
                ...options
            }
        })
    },
    axiosPost: async (options = {}) => {
        return await axios({
            method: "POST",
            url: process.env.NETSUITE_URL,
            headers: {
                'Authorization': OAuth({ ...options, httpmethod: "POST" }),
                'Content-Type': 'application/json'
            },
            params: {
                ...options
            }
        })
    }
}