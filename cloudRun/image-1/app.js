const express = require('express');
const app = express();

app.get('/', (req, res) => {
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
