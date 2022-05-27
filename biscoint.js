const axios = require("axios");
const createHmac = require("crypto-js/hmac-sha384");

async function meta() {
    return call('meta');
}

function sign(endpoint, nonce, data) {
    const strToBeSigned = `v1/${endpoint}${nonce}${data}`;
    const hashBuffer = Buffer.from(strToBeSigned).toString("base64");

    return createHmac(hashBuffer, process.env.API_SECRET).toString();
}

async function call(endpoint, params, method = 'GET') {
    const headers = {
        "Content-Type": "application/json"
    };

    const url = `https://api.biscoint.io/v1/${endpoint}`;
    let data = undefined;

    if (method === 'POST') {
        params = params || {};
        data = JSON.stringify(params, Object.keys(params).sort());

        const nonce = `${Date.now() * 1000}`;
        const signedParams = sign(endpoint, nonce, data);

        headers["BSCNT-NONCE"] = nonce;
        headers["BSCNT-APIKEY"] = `${process.env.API_KEY}`;
        headers["BSCNT-SIGN"] = signedParams;

        data = JSON.parse(data);
    }

    const config = {
        url,
        method,
        headers,
        data,
        timeout: 5000
    }

    const result = await axios(config);
    return result.data;
}

async function ticker(base = 'BTC', quote = 'BRL') {
    return call(`ticker?base=${base}&quote=${quote}`);
}

module.exports = {
    meta,
    ticker
}