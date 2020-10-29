const express = require('express')
const fs = require('fs')
const path = require('path')
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
       for (let i = 0; i < 5; i++) {
           shopIDs.push(list[i].shop_id)
       }
       res.send(shopIDs)
   })
   .catch(err => res.send(err));
});

//get listings of 25 random shopIds
app.get('/shopListing', (req, res) => {
    let url = `https://openapi.etsy.com/v2/shops/:shop_id/listings/active?api_key=${apiKey}`;

    for (let i = 0; i < shopIDs.length; i++) {
        let shop = shopIDs[i];
        let myParams = {'shop_id': shop};

        //check if there is a file for that shop
        fs.readFile(`./shopsListings/${shop}`, 'utf8',  (err, data) => {
            //if no file, fetch for creating a new file
            if (err) {
                axios.get(url, {
                params: myParams
                })                      
                .then(data=>{
                    let shopInfo = data.data
                    let listings = shopInfo.results
                    //console.log('shop: ',shop, 'listings: ', listings)
                    fs.appendFile(`shopsListings/${shop}.txt`, `${JSON.stringify(listings)}`, function(err) {
                        if (err) throw err;
                        console.log('file created!')
                    })
                    res.end()
                })
                .catch(err=>res.send(err))
            } else {
                //if yes, fetch for current info
                //search for differences in files(items added and items removed)
                axios.get(url, {
                params: myParams
                })                      
                .then(data=>{
                    console.log(data.data)    
                    res.send('check this file')
                })
                .catch(err=>res.send(err))
            };
        })            
    }
})

app.listen(port, ()=> console.log(`Listening on port ${port}`))
