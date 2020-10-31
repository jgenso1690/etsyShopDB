require('dotenv').config()
const apiKey = process.env.API_KEY;

const express = require('express')
const axios = require('axios')
const fs = require('fs')
const processor = require('./processor.js')
const connector = require('./connector.js')

const app = express()
const port = 3000

//get list of 25 random shop Ids, limit for external API is 10 requests per second
//use this call to get 25 shop Ids with setTimeout
let shopIDs = [25861217,25861265];
app.get('/shop-ids', (req, res) => {
   var url = `https://openapi.etsy.com/v2/shops?callback=findAllShopListingsActive&api_key=${apiKey}`

   axios.get(url)
   .then(data => {
       let list = data.data.results;
       for (let i = 0; i < 5; i++) {
        if (!shopIDs.includes(list[i])) {  
        shopIDs.push(list[i].shop_id)
        }
       }
       res.send(shopIDs)
   })
   .catch(err => res.send(err));
});

//get listings of 25 random shopIds
app.get('/shop-listing', (req, res) => {
    for (let i = 0; i < shopIDs.length; i++) {
        let shopId = shopIDs[i];
        let shopIdParam = {'shop_id': shopId};

        
        let shopInfo = connector(shopIdParam);
        
        shopInfo.then(resolve => {       
            //check if there is a file for that shop
            fs.readFile(`./shopsListings/${shopId}.txt`, 'utf8', (err, data) => {
                if (err) {                    
                  fs.writeFile(`shopsListings/${shopId}.txt`, `${JSON.stringify(resolve)}`, function(err) {
                      if (err) throw err;
                      console.log(`New file for Shop ID ${shopId}`);
                  })
                } else {
                  processor(resolve, data, shopId);
                }
            })
        })
        .catch(err=> console.log(err))
    }
    res.end()
})

app.listen(port, ()=> console.log(`Listening on port ${port}`))
