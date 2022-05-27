const apiKeyCheck = process.env.API_KEY;
const apiSecretCheck = process.env.API_SECRET;

if (!apiKeyCheck || !apiSecretCheck) {
    console.log(`Crendentials not found!`);
    process.exit(0);
}

let BRL, BTC;

const biscoint = require("./biscoint");

function percent(value1, value2) {
    return (Number(value2) / Number(value1) - 1) * 100;
}

async function loadBalance() {
    console.log(`Loadig balance...`)
    const result = await biscoint.balance();
    BRL = result.data.BRL;
    BTC = result.data.BTC;
    console.log(`BRL: ${BRL}`);
    console.log(`BTC: ${BTC}`);
}

async function doCycle() {
    try {
        if (!BRL) {
            await loadBalance();
        }
    } catch (err) {
        console.error(err.response ? err.response.data : err.message);
    }
}

setInterval(doCycle, 5010);

doCycle();