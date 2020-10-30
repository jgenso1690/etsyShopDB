require('dotenv').config()
const axios = require('axios')

const apiKey = process.env.API_KEY;

const url = `https://openapi.etsy.com/v2/shops/:shop_id/listings/active?api_key=${apiKey}`;

const getShopInfo = function(shopParams) {
        
        return axios.get(url, { 
        params: shopParams 
        })
        .then(data => {
            let shopData = data.data;
            var allListings = shopData.results;
            return(allListings) 
        })
        .catch(err=> {
            console.log(err)
        })

}
module.exports = getShopInfo;
