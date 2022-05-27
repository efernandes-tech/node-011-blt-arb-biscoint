const apiKeyCheck = process.env.API_KEY;
const apiSecretCheck = process.env.API_SECRET;

if (!apiKeyCheck || !apiSecretCheck) {
    console.log(`Crendentials not found!`);
    process.exit(0);
}

let BRL, BTC, ETH, base = 'BTC';

const biscoint = require("./biscoint");

function percent(value1, value2) {
    return (Number(value2) / Number(value1) - 1) * 100;
}

async function loadBalance() {
    console.log(`Loadig balance...`)
    const result = await biscoint.balance();
    BRL = result.data.BRL;
    BTC = result.data.BTC;
    ETH = result.data.ETH;
    console.log(`BRL: ${BRL}`);
    if (base == 'BTC') console.log(`BTC: ${BTC}`);
    if (base == 'ETH') console.log(`ETH: ${ETH}`);
}

async function doCycle() {
    try {
        if (!BRL) {
            await loadBalance();
        }

        console.log('Getting a Buy Offer');
        const buyOffer = await biscoint.offer(BRL, 'buy', base);

        console.log('Getting a Sell Offer');
        const sellOffer = await biscoint.offer(buyOffer.data.baseAmount, 'sell', base);

        console.log('Buy Price: ' + buyOffer.data.efPrice);
        console.log('Sell Price: ' + sellOffer.data.efPrice);

        const gap = percent(buyOffer.data.efPrice, sellOffer.data.efPrice);
        console.log(`%: ${gap.toFixed(2)}`);

        if (gap >= 1) {
            console.log("SHOOT!")
            const buyResult = await biscoint.confirmOffer(buyOffer.data.offerId);
            const sellResult = await biscoint.confirmOffer(sellOffer.data.offerId);
            console.log('buyResult', buyResult);
            console.log('sellResult', sellResult);
            await loadBalance();
            process.exit();
        }

    } catch (err) {
        console.error(err.response ? err.response.data : err.message);
    }
}

setInterval(doCycle, 4010);

doCycle();