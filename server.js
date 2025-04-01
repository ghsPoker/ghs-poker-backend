const express = require('express')
const cors = require('cors')

const app = express()
const port = 3000
const allowedOrigins = ['http://ghsPoker.github.io/']

app.use(
    cors({
        origin: function (origin, callback) {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error('Not allowed by CORS'));
            }
        },
        credentials: true, // If using cookies or authentication
        })
    );

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.get('/log-in/', (req, res) => {
    //compare credentials to MongoDB
    res.send('MongoDB connection Port')
})

app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})