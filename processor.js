const fs = require('fs')

const processFile = function(newShopInfo, shopInfoFile, shopId) {
  if (JSON.stringify(newShopInfo) === shopInfoFile) {
      return 'Shop ID' + ' ' + shopId + '\n' + 'No Changes since last sync' + '\n';
  } else {
    let listingsOnFile = JSON.parse(shopInfoFile);
    let newListings = {};
    let pastListings = {};
    let i = 0;                
    while (i < listingsOnFile.length || i < newShopInfo.length ) {
      if (listingsOnFile[i]) {
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
    let newListingsKeys = Object.keys(newListings);
    let pastListingsKeys = Object.keys(pastListings);
    while (j < newListingsKeys.length || j < pastListingsKeys.length ) {
      if (pastListingsKeys[j] && !newListingsKeys.includes(pastListingsKeys[j])) {
          let listingNumber = pastListingsKeys[j];
          let title = pastListings[pastListingsKeys[j]];
          let change = `- removed listing ${listingNumber} "${title}"`;
          itemsRemoved.push(change);
      }                        
      if (newListingsKeys[j] && !pastListingsKeys.includes(newListingsKeys[j])) {
          let listingNumber = newListingsKeys[j];
          let title = newListings[newListingsKeys[j]];
          let change = `+ added listing ${listingNumber} "${title}"`;
            itemsAdded.push(change);
      }
      j++
    }      
    updateFile(newShopInfo, shopId)
    return printChanges(itemsRemoved, itemsAdded, shopId)  
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
  return changes;
}

const updateFile = function(data, id) {
  fs.writeFile(`shopsListings/${id}.txt`, `${JSON.stringify(data)}`, function(err) {
      if (err) throw err;
  })
}

module.exports = processFile;
