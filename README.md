# etsyShopDB

# Project Stack:
* Language: Javascript
* Nodejs 
* Expressjs
* Nodemon
* Axios
* Curl
* Body-parser
* Dotenv

# Project Instructions:

* ## setup
  _Npm install_

* ## Compiles and reloads for development
  _Npm start_

* ## Triggering the application
    * ### With Postman:
        * Body: {"shopIDs":[insert Etsy Shop IDs]}
        * Make a Post request to: http://localhost:3000/shop-listing
    * ### With Curl:
        * Insert a list of Etsy Shop IDs inside the array correspondent to the key “shopIDs”, then run the curl command
        * Curl command:
            curl --header "Content-Type: application/json" \
            --request POST \
            --data '{"shopIDs":[insert Etsy Shop IDs]}' \
            http://localhost:3000/shop-listing


# How it works:
The first call will create a file.txt for each Shop ID
Any following call to the same Shop IDs will return any changes on each file and will update it accordingly.


# Challenges you ran into
- 


# Highlights 
(_Areas of the code you are most proud of_):
- Non-blocking architecture. Javascript is a single-threaded language that can take the application to performance issues due to a blocked stack.  For that reason, I used promises inside the post method. Promises allow Javascript to run asynchronously. I achieved a controlled flow by creating a promise for every Shop Id, which at the same time returned a promise itself for reading, creating, or updating it. Then, I wrapped all the promises inside one (Promise.all). This process works with a micro-queue, where each resolved value from each promise is added. Later, once they are all finished, all those results will be passed as one to the main queue. Finally, the event loop takes this result and returns it.


# Room for improvement 
(_Areas of the code you are least proud of_)
- For further development, I would redesign the ‘processFile’ method abstracting by functionality. Design refactoring is highly important for future development because it results in a more flexible and understandable application allowing future programmers to easily recognize what is happening. It will also facilitate unit testing, which takes us to continuous integration.


# Tradeoffs
- Due to time constraints I decided to store the information in text files, consequently, the performance of the application will be jeopardized directly by the size of the input.


# Next Steps
- To continue developing this service my next step would be to pick a database. This decision will be base on the type of data. Each Shop is independent of each other, they don't have relational data, and the data returned from the external API is JSON-formatted. That’s why I would choose MongoDB. This database is flexible and scalable which will give the application room to keep growing without jeopardizing performance.
For the next step, I would set up a private file to create a connection with the database and another file to set up any CRUD methods necessary to query the database. Based on what I’ve done so far, I know I will need 3 of the CRUD methods: Create, Read, and Update. Later, I will require such file in my server.js file. In my server.js file, I will need to refactor my post method for my endpoint ‘/shop-listings’ the following way: the method receives (same as before) the list of ids in the body of the request. Then, it will use the Read method to read the shop Ids that are already in the database and compare them with the list received. Next, if it can’t find the Id it will use the Create method to create a new document inside the database for that Shop Id. If there is a Shop Id match, the method will proceed with the information retrieved from the database(previously with the Read method) and make a call to the external API. Finally, it will compare the two documents (the one in the database and the one received from the API), identify and return the differences, and it will use the Update method to sync the new information in the database. Here is the pseudocode:

`    app.post('/shop-listing', (req, res) => {
  //create a variable to hold the list of ShopIds from the request
  //Iterate through the ShopIds list and for each one do the following:
    //call the Read method and compare to the ShopId
      //if there is no match, use the Create method to save the new information
      //if there was a match:
        //create a variable to hold the complete information from the database for that ShopId
   //create a variable to hold the information received from calling the external 	API(connector file), this will return a promise.
         //use the .then keyword to wait for the asynchronous response from the external API.
	//pass the 2 documents to the processFile method
	//send response with the information received.
`

