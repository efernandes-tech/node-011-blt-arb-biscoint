const biscoint = require("./biscoint");

function percent(value1, value2) {
    return (Number(value2) / Number(value1) - 1) * 100;
}

async function doCycle() {
    try {
        const result = await biscoint.ticker();
        console.log("BID: " + result.data.bid);
        console.log("ASK: " + result.data.ask);
        console.log("%: " + percent(result.data.bid, result.data.ask));
    } catch (err) {
        console.error(err);
    }
}

setInterval(doCycle, 5010);

doCycle();