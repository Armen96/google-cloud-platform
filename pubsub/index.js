const express = require('express');
const cors = require('cors')
const {PubSub} = require('@google-cloud/pubsub');
const app = express();
const pubsub = new PubSub();

app.use(cors());
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
    console.log('Press Ctrl+C to quit.');
});

app.post('/', async (req, res) => {
    const category = {name: 'Band', title: 'Guitarist and Lead Vocalist', description: 'Loves long walks on the beach', date: 'Member since 1988'};

    await publishPubSubMessage(category);
    res.status(204).send();
});

async function publishPubSubMessage(data) {
    const buffer = Buffer.from(JSON.stringify(data));
    await pubsub.topic('handle-process-team-scorecard').publish(buffer);
}
