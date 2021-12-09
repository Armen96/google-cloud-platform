const express = require('express');
const path = require("path");
const cors = require('cors')
const app = express();

app.use(cors());
app.use(express.static(path.join(__dirname, 'views')));
app.use((req, res, next) => {
    res.set({'Cache-control': 'no-store', 'Expires': '0'});
    next();
})

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname) + '/views/index.html')
});

app.get('/categories', (req, res) => {
    const categories = [
        {name: 'Band', title: 'Guitarist and Lead Vocalist', description: 'Loves long walks on the beach', date: 'Member since 1988'},
        {name: 'Drummer', title: 'Drummer 1st', description: 'Loves Drummer', date: 'Member since 1972'},
        {name: 'Player', title: 'Bass Bass player', description: 'Loves Bass player', date: 'Member since 1965'},
    ];
    res.send(categories);
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
    console.log('Press Ctrl+C to quit.');
});

module.exports = app;