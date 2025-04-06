const express = require('express');
const cors = require('cors');
const {MongoClient} = require('mongodb')
const bcrypt = require('bcryptjs');
const { hash } = require('bcryptjs');
let db;
require('dotenv').config();

const app = express()
const port = process.env.PORT || 8080;
const allowedOrigins = ['https://ghspoker.github.io/'];

const connectionString = process.env.MONGODB_CONNECTION_STRING;
if (!connectionString) {
    console.log('No connection string provided')
    process.exit(0)
}
const client = new MongoClient(connectionString);

app.use(
    cors({
        origin: function (origin, callback) {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(null, false);
            }
        },
        credentials: true, // If using cookies or authentication
        })
    );

app.use(express.json());

app.post('/user/log-in/', (req, res) => {
    console.log('POST request on path "/user/log-in/"');
    //some mongodb stuff
    res.sendStatus(200)
})

app.post('/user/sign-up/', (req, res) => {
    console.log('POST request on path "/user/sign-up"');

    //Handling missing arguments or invalid arguments
    const receivedData = req.body
    if (!receivedData.username || !receivedData.password || receivedData.username.length < 3 || receivedData.password.length < 8) {
        res.status(400).json({"message": "Invalid username or password", "sendData": receivedData});
        console.log("Invalid username or password")
        return;
    }

    // Handling username being already taken
    (async () => {
        const user = await db.findOne({"username": receivedData.username})
        if (user) {
            res.status(400).json({"message": "Username already taken", "sendData": receivedData});
            console.log("Username already taken")
            return;
        }

        await db.insertOne({"username": receivedData.username, "password": bcrypt.hashSync(receivedData.password)})
        res.status(201).json({"message": "Successfully created account", "sendData": receivedData})
        console.log("Successfully created account")
    })();
})

app.listen(port, async () => {
    try {
        await client.connect();
        db = client.db('ghsPoker').collection('userData')
    } catch (err) {
        console.log(err);
    };

    console.log(`App listening on port ${port}`);
});

process.on('SIGINT', async () => {
    console.log('Closing MongoDB connection');
    await client.close();
    process.exit(0);
});

process.on('SIGTERM', async () => {
    console.log('Closing MongoDB connection');
    await client.close();
    process.exit(0);
});