require('dotenv').config();
const express = require("express");
const { ObjectId } = require("mongodb");
const bodyParser = require('body-parser');

const { MDBconnect, MDBdisconnect } = require("./mongoConnect");

const app = express();
app.use(express.static('public'))

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.redirect("./index.html");
})

app.post("/login", async (req, res) => {
    try {
        let { email, password } = req.body;
        const db = await MDBconnect();
        const collection = db.collection('users');
        const result = await collection.findOne({ email: email });
        if (!result) {
            return res.json({ success: false, message: "No account Associated with this email exists Signup First" });
        }
        if (password == result.password) {
            res.json({ success: true, name: result.name });
        } else {
            res.json({ success: false, message: "Invalid email or password" });
        }

    } catch (error) {
        console.log(error)

    } finally {
        MDBdisconnect();
    }
});

app.post("/signup", async (req, res) => {
    try {
        let { name, email, password } = req.body;
        const db = await MDBconnect();
        const collection = db.collection('users');
        const result = await collection.findOne({ email: email });
        if (!result) {
            await collection.insertOne({ name, email, password });
            res.json({ success: true });
        } else {
            res.json({ success: false });
        }

    } catch (error) {
        console.log(error)

    } finally {
        MDBdisconnect();
    }
})

app.post("/cart", async (req, res) => {
    try {
        let { title, price, size, image, email } = req.body;
        const db = await MDBconnect();
        const collection = db.collection('cart');
        const result = await collection.findOne({ email: email, title: title, size: size });
        if (!result) {
            await collection.insertOne({ title, price, size, image, email });
            res.json({ success: true });
        } else {
            res.json({ success: false, message: "Item already Exists in Cart" });
        }

    } catch (error) {
        console.log(error)

    } finally {
        MDBdisconnect();
    }
})
app.get("/fetchcart", async (req, res) => {
    try {
        let email = req.query.email;
        const db = await MDBconnect();
        const collection = db.collection('cart');
        const result = await collection.find({ email: email }).toArray();
        if (result.length > 0) {
            res.json({ success: true, data: result });
        } else {
            res.json({ success: false, message: "Cart is Empty" });
        }

    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error" });
    } finally {
        MDBdisconnect();
    }
});

app.get('/deleteItem', async (req, res) => {
    try {
        const { email, title, size } = req.query;
        
        // Connect to MongoDB
        const db = await MDBconnect();
        const collection = db.collection('cart');
        
        // Delete the item
        const result = await collection.deleteOne({ email, title, size });
        
        if (result.deletedCount === 1) {
            console.log(`Deleted item: ${title}`);
            res.redirect("/cart.html");
        } else {
            console.log(`Item not found: ${title}`);
            res.status(404).json({ success: false, message: 'Item not found' });
        }
    } catch (error) {
        console.error('Error deleting item:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    } finally {
        // Disconnect from MongoDB
        MDBdisconnect();
    }
});

app.post("/GetOrder", async (req, res) => {
    try {
        const { name,email,address,city,zip,country,total_amount,products } = req.body;
        const db = await MDBconnect();
        const collection = db.collection('orders');
        const result = await collection.insertOne({ name, email, address, city, zip, country, total_amount, products, status:'pending'});
        if (result.insertedId) {
            res.json({ success: true });
        } else {
            res.json({ success: false, message: 'Error Placing order'});
        }

    } catch (error) {
        console.log(error)

    } finally {
        MDBdisconnect();
    }
})
app.post("/reviews", async (req, res) => {
    try {
        const { text, rating, title , name } = req.body;
        const db = await MDBconnect();
        const collection = db.collection('reviews');
        const result = await collection.insertOne({text, rating, title, name});
        if (result.insertedId) {
            res.json({ success: true });
        } else {
            res.json({ success: false, message: 'Error Updating Review'});
        }

    } catch (error) {
        console.log(error)

    } finally {
        MDBdisconnect();
    }
})

app.post("/getreviews", async (req, res) => {
    try {
        let {title} = req.body;
        const db = await MDBconnect();
        const collection = db.collection('reviews');
        const result = await collection.find({title: title}).toArray();
        if (result) {
            res.json({success:true, data: result});
        } else {
            res.json({ success: false, message: "No Reviews Yet" });
        }

    } catch (error) {
        console.log(error)

    } finally {
        MDBdisconnect();
    }
})


app.listen(3000);