const CryptoJS = require("crypto-js");
const moment = require('moment');

function getNonce(length) {
    let text = "";
    let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

const genOauthToken = (options = { script: 322, deploy: 1, httpmethod: "GET" }) => {
    const defaultData = {
        oauth_consumer_key: process.env.OAUTH_CUSTOMER_KEY,
        oauth_token: process.env.OAUTH_TOKEN,
        consumer_secret: process.env.CONSUMER_SECRET,
        token_secret: process.env.TOKEN_SECRET,
        baseurl: process.env.NETSUITE_URL,
        accountid: process.env.ACCOUNT_ID,
        oauth_version: process.env.OAUTH_VERSION,
        oauth_nonce: getNonce(32),
        oauth_timestamp: moment().unix(),
        oauth_signature_method: process.env.OAUTH_SIGNATURE_METHOD
    };

    const data = {
        ...defaultData,
        ...options
    };

    let keys = Object.keys(data).sort();
    let dataOauth = '';

    for (let i = 0; i < keys.length; i++) {
        if (keys[i] != "token_secret" && keys[i] != "consumer_key" && keys[i] != "httpmethod" && keys[i] != "baseurl" && keys[i] != "consumer_secret" && keys[i] != "accountid") {
            dataOauth += keys[i] + '=' + data[keys[i]] + '&';
        }
    }
    dataOauth = dataOauth.slice(0, -1)

    const OAUTH_CONSUMER_KEY = data.oauth_consumer_key;
    const OAUTH_TOKEN = data.oauth_token;
    const TOKEN_SECRET = data.token_secret;
    const HTTP_METHOD = data.httpmethod;
    const BASE_URL = data.baseurl;
    const CONSUMER_SECRET = data.consumer_secret;
    const NETSUITE_ACCOUNT_ID = data.accountid;

    const encodedData = encodeURIComponent(dataOauth);
    const completeData = `${HTTP_METHOD}&${encodeURIComponent(BASE_URL)}&${encodedData}`;
    const hmacsha256Data = CryptoJS.HmacSHA256(completeData, `${CONSUMER_SECRET}&${TOKEN_SECRET}`);
    const base64EncodedData = CryptoJS.enc.Base64.stringify(hmacsha256Data);
    const oauth_signature = encodeURIComponent(base64EncodedData);

    let OAuth = `OAuth oauth_signature="${oauth_signature}",oauth_version="${data.oauth_version}",oauth_nonce="${data.oauth_nonce}",oauth_signature_method="${data.oauth_signature_method}",oauth_consumer_key="${OAUTH_CONSUMER_KEY}",oauth_token="${OAUTH_TOKEN}",oauth_timestamp="${data.oauth_timestamp}",realm="${NETSUITE_ACCOUNT_ID}"`;
    return OAuth;
}

module.exports = genOauthToken;