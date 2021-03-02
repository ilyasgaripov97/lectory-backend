const express = require('express')

const app = express();

app.get('/login', (req, res) => {
    res.send(200)
})

app.listen(5000)