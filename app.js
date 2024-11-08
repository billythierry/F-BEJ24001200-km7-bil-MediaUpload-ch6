require('dotenv').config();

const express = require('express');
const router = require('./routes/imageRouter');
const app = express();
const port = 3000

app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

app.use('/', router);


app.listen(port, (req, res) => {
    console.log(`Port ${port} sedang berjalan`);
});