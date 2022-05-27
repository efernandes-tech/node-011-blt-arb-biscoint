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

        console.log('Getting a Buy Offer');
        const buyOffer = await biscoint.offer(BRL, 'buy');

        console.log('Getting a Sell Offer');
        const sellOffer = await biscoint.offer(buyOffer.data.baseAmount, 'sell');

        console.log('Buy Price: ' + buyOffer.data.efPrice);
        console.log('Sell Price: ' + sellOffer.data.efPrice);

        const gap = percent(buyOffer.data.efPrice, sellOffer.data.efPrice);
        console.log(`%: ${gap.toFixed(2)}`);

        if (gap > 10) {
            const buyResult = await biscoint.confirmOffer(buyOffer.data.offerId);
            const sellResult = await biscoint.confirmOffer(sellOffer.data.offerId);
            console.log(sellResult);
            loadBalance();
        }

    } catch (err) {
        console.error(err.response ? err.response.data : err.message);
    }
}

setInterval(doCycle, 5010);

doCycle();