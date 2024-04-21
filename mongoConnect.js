const { MongoClient } = require('mongodb');
const url = 'mongodb+srv://riteshgadakh04:Zyw1b1Fp5Qz3J10k@passionforfashion.cikcd64.mongodb.net/';
const dbName = 'Ecom';
let client = null;
async function MDBconnect(){
    client = new MongoClient(url);
    await client.connect();
    console.log("MongoDB Connected")
    return client.db(dbName);
}
async function MDBdisconnect(){
    if(client){
        client.close();
        console.log("MongoDB Disconnected");
    }
}
module.exports= {MDBconnect, MDBdisconnect};
