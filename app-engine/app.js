'use strict';

// [START gae_node_request_example]
const express = require('express');
const path = require('path');

const app = express();
app.use(express.static(path.join(__dirname, 'views')));
app.use((req, res, next) => {
    res.set({
        'Cache-control': 'no-store',
        'Expires': '0'
    });
    next();
})

app.get('/tasks/summary', (req, res) => {
    res.status(200).send('Summary...').end();
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname) + '/views/index.html')
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
    console.log('Press Ctrl+C to quit.');
});

module.exports = app;