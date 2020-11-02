require('dotenv').config()
const apiKey = process.env.API_KEY;

const express = require('express')
const axios = require('axios')
const fs = require('fs')
const bodyParser = require ('body-parser')
const processor = require('./processor.js')
const connector = require('./connector.js')

const app = express()
const port = 3000

app.use(bodyParser.json())

//get 5 random shop Ids
/*let shopIDs = [];
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
});*/

app.post('/shop-listing', async (req, res) => {
   const { shopIDs } = req.body;
   const promiseArray = shopIDs.map(shopId => {
     let shopIdParam = {'shop_id': shopId};
     let shopInfo = connector(shopIdParam)
     return shopInfo.then(resolve => {
       return new Promise((resolvePromise, reject) => {
         if (resolve === 'Error') {
           resolvePromise(`Invalid Shop ID ${shopId}` + '\n')
         } else {
           fs.readFile(`./shopsListings/${shopId}.txt`, 'utf8', (err, data) => {
             if (err) {                    
               fs.writeFile(`shopsListings/${shopId}.txt`, `${JSON.stringify(resolve)}`, function(err) {
                 if (err) throw err;
                 let change = `New file for Shop ID ${shopId}`;
                 resolvePromise(change)
               })
             } else {
               let change = processor(resolve, data, shopId);
               resolvePromise(change)
             }
           })
         }
       })
     })
   })

   Promise.all(promiseArray)
    .then((values) =>{      
      const result = values.join("\n")
      console.log(result)
      res.send(result)
   }).catch(err=> console.log(err))
})

app.listen(port, ()=> console.log(`Listening on port ${port}`))
