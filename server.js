const express = require('express')
require('dotenv').config()
const axios = require('axios')

const apiKey = process.env.API_KEY;
const app = express()
const port = 3000

//get list of 25 random shopIds
let shopIDs = [];
app.get('/shopIds', (req, res) => {
   var url = `https://openapi.etsy.com/v2/shops?callback=findAllShopListingsActive&api_key=${apiKey}`

   axios.get(url)
   .then(data => {
       let list = data.data.results;
       for (let i = 0; i < list.length; i++) {
           shopIDs.push(list[i].shop_id)
       }
       res.send(shopIDs)
   })
   .catch(err => res.send(err));
});

//get listings of 25 random shopIds
app.get('/shopListing', (req, res) => {
    let url = `https://openapi.etsy.com/v2/shops/:shop_id/listings/active?api_key=${apiKey}`
    for (let i = 0; i < shopIDs.length; i++) {
        let shop = shopIDs[i];
        let myParams = {'shop_id': shop};
    
        axios.get(url, {
            params: myParams
        })                      
        .then(data=>res.send(data.data))
        .catch(err=>res.send(err))
    }
})



app.listen(port, ()=> console.log(`Listening on port ${port}`))