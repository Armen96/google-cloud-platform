// Publisher
exports.weeklyJob = functions
    .runWith(runtimeOpts)
    .pubsub
    .schedule('0 0 * * 1')
    .onRun(async context => {
        const premiumTeams = [{id: 1, name: 'Team N1'}];
        if (premiumTeams && premiumTeams.length) {
            const dataPayload = {teamId: null}

            for (let i = 0; i < premiumTeams.length; i++) {
                dataPayload.teamId = premiumTeams[i].id;

                const buffer = Buffer.from(JSON.stringify(dataPayload));
                await pubsub.topic('trigger-team-topic-data').publish(buffer);
            }
        }
    })


// Subscriber
exports.topicFunction = functions.pubsub.topic('trigger-team-topic-data').onPublish(async (message, context) => {
    const content = message.data ? Buffer.from(message.data, 'base64').toString() : null;
    const messageBody = JSON.parse(content);

    if (messageBody) {
       // ...
    }
});
