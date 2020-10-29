const express = require('express')
const fs = require('fs')
const path = require('path')
require('dotenv').config()
const axios = require('axios')

const apiKey = process.env.API_KEY;
const app = express()
const port = 3000

//get list of 25 random shopIds
let shopIDs = [19409107];
app.get('/shopIds', (req, res) => {
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
app.get('/shopListing', (req, res) => {
    let url = `https://openapi.etsy.com/v2/shops/:shop_id/listings/active?api_key=${apiKey}`;

    for (let i = 0; i < shopIDs.length; i++) {
        let shop = shopIDs[i];
        let myParams = {'shop_id': shop};
        console.log('shopids', shopIDs)
        //check if there is a file for that shop
        fs.readFile(`./shopsListings/${shop}.txt`, 'utf8',  (err, response) => {
            //if no file, fetch for creating a new file
            if (err) {
                axios.get(url, {
                params: myParams
                })                      
                .then(data=>{
                    let shopInfo = data.data
                    let listings = shopInfo.results
                    fs.appendFile(`shopsListings/${shop}.txt`, `${JSON.stringify(listings)}`, function(err) {
                        if (err) throw err;
                        console.log(shop,'file created!')
                    })
                    res.end()
                })
                .catch(err=>res.send(err))
            } 

        
                let pastListingOnFile = response;
                res.send(processFile(response, myParams, shop))
                
                /*console.log('----------------------------------------------------------------', pastListingOnFile)
                axios.get(url, {
                params: myParams
                })                      
                .then(data=>{
                    let currentShopInfo = data
                    let currentlistings = currentShopInfo.results
                    //console.log('response;', JSON.parse(response))
                    res.send('check this file', currentShopInfo)
                    /*if (JSON.stringify(currentlistings) === pastListingOnFile) {
                        console.log('no changes')
                    }   
                })
                .catch(err=>res.send(err))
                */

                
            
        })
        
    }

    function processFile(response, myParams, shop) {
        axios.get(url, {
            params: myParams
            })                      
            .then(data=>{
                let currentShopInfo = data.data
                let currentListings = currentShopInfo.results
                //res.send('check this file', currentShopInfo)
                if (JSON.stringify(currentListings) === response) {
                    console.log('no changes')
                } else {
                    console.log('changes')
                    let pastListingsObj = JSON.parse(response);
                    currentListings

                    let currentInventory = {};
                    let pastInventory = {};
                    let i = 0
                    console.log('LENGTH',currentListings.length)
                    
                    while (i < pastListingsObj.length || i < currentListings.length ) {
                        if (pastListingsObj[i]["listing_id"]) {
                            pastInventory[pastListingsObj[i]["listing_id"]] = pastListingsObj[i]["title"];
                        }
                        
                        if (currentListings[i]["listing_id"]) {
                            currentInventory[currentListings[i]["listing_id"]] = currentListings[i]["title"];
                        }
                        i++
                    }
                    
                    let j = 0;
                    let itemsAdded = [];
                    let itemsRemove = [];
                    while (j < Object.keys(currentInventory).length || j < Object.keys(pastInventory).length ) {
                        if (!Object.keys(currentInventory).includes(Object.keys(pastInventory)[j])) {
                            let listingNumber = Object.keys(pastInventory)[j];
                            let title = pastInventory[Object.keys(pastInventory)[j]];
                            let change = `- remove listing ${listingNumber} ${title}`;
                            itemsRemove.push(change);
                        }                        
                        if (!!Object.keys(pastInventory).includes(Object.keys(currentInventory)[j])) {
                            console.log('item added', currentInventory[Object.keys(currentInventory)[j]])
                            let listingNumber = Object.keys(currentInventory)[j];
                            let title = currentInventory[Object.keys(currentInventory)[j]];
                            let change = `+ added listing ${listingNumber} ${title}`;
                            itemsAdded.push(change);
                        }
                        j++
                    }

                    printChanges(itemsRemove, itemsAdded, shop)                    
                     
                }   
            })
            //.catch(err=>res.send(err))
    }

    
})

app.listen(port, ()=> console.log(`Listening on port ${port}`))
