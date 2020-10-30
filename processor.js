const fs = require('fs')

const processFile = function(newShopInfo, shopInfoFile, shopId) {
    if (JSON.stringify(newShopInfo) === shopInfoFile) {
      console.log('Shop ID' + ' ' + shopId + '\n' + 'No Changes since last sync' + '\n');
    } else {
      let listingsOnFile = JSON.parse(shopInfoFile);
      let newListings = {};
      let pastListings = {};
      let i = 0;                
      while (i < listingsOnFile.length || i < newShopInfo.length ) {
        if (listingsOnFile[i]["listing_id"]) {
            pastListings[listingsOnFile[i]["listing_id"]] = listingsOnFile[i]["title"];
        }        
        if (newShopInfo[i]) {
            newListings[newShopInfo[i]["listing_id"]] = newShopInfo[i]["title"];
        }
        i++
      }
      
      let j = 0;
      let itemsAdded = [];
      let itemsRemoved = [];
      while (j < Object.keys(newListings).length || j < Object.keys(pastListings).length ) {
         if (!Object.keys(newListings).includes(Object.keys(pastListings)[j])) {
             let listingNumber = Object.keys(pastListings)[j];
             let title = pastListings[Object.keys(pastListings)[j]];
             let change = `- removed listing ${listingNumber} "${title}"`;
             itemsRemoved.push(change);
         }                        
         if (!!Object.keys(pastListings).includes(Object.keys(newListings)[j])) {
             let listingNumber = Object.keys(newListings)[j];
             let title = newListings[Object.keys(newListings)[j]];
             let change = `+ added listing ${listingNumber} "${title}"`;
             itemsAdded.push(change);
         }
         j++
      }      
      printChanges(itemsRemoved, itemsAdded, shopId)  
      updateFile(newShopInfo, shopId)
    }                 
};   

const printChanges = function(removed, added, shopID) {     
    let changes = 'Shop ID' + ' ' + shopID + '\n';
    for (let i = 0; i < removed.length; i++) {
        changes+=removed[i] + '\n'
    }
    for (let j = 0; j < added.length; j++) {
        changes+=added[j] + '\n'
    }
    if (removed.length === 0 && added.length === 0) {
        changes+='No Changes since last sync' + '\n'
    }
    console.log(changes)
}

const updateFile = function(data, id) {
    fs.writeFile(`shopsListings/${id}.txt`, `${JSON.stringify(data)}`, function(err) {
        if (err) throw err;
    })
}

module.exports = processFile;
