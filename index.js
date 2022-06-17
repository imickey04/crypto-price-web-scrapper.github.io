const PORT = 8000;
const axios = require('axios');
const cheerio = require('cheerio');
const express = require('express');

const app = express();

async function getCryptoPrice() {
    try {

        const siteUrl = "https://coinmarketcap.com/";

        const { data } = await axios({
            method : "GET",
            url : siteUrl
        });

        const $ = cheerio.load(data);

        console.log($);

        const elemSelector = ".h7vnx2-2 > tbody:nth-child(3) > tr"

        const keys = [
            "rank",
            "name",
            "price",
            "24Hr",
            "7D",
            "marketCap",
            "volume",
            "circularSupply"
        ]

        const coinArr = [];

        $(elemSelector).each((parentIndex, parentElem) => {

            let keyIndex = 0;

            const coinObj = {};

            if (parentIndex <= 9){
                $(parentElem).children().each((childIndex, childElem) => {
                    let tdValue = ($(childElem).text());

                    if (keyIndex === 1 || keyIndex === 6){
                        tdValue = ($('p:first-child', $(childElem).html()).text())
                    }

                    if (tdValue){
                        
                        coinObj[keys[keyIndex]] = tdValue;

                        keyIndex++;
                    }
                })

                coinArr.push(coinObj);
            }
        })

        return coinArr;

    } catch (err) {
        console.log(err);
    }
}

app.listen(PORT.env || 8000, () => {
    console.log(`Server is live on Port: ${PORT}`);
});

app.get('/api/crypto-price', async (req, res) => {

    try{

        const  cryptoPrice = await getCryptoPrice();

        return res.status(200).json({
            result: cryptoPrice,
        }) 

    } catch(err){

        return res.status(500).json({
            err: err.toString(),
        })
    }

})