const functions = require('firebase-functions');
const {BigQuery} = require("@google-cloud/bigquery")
const {PubSub} = require('@google-cloud/pubsub')

const runtimeOpts = {timeoutSeconds: 540, memory: '2GB'}
const bigQueryConfig = { datasetID: 'xxxxxxxx', table: 'users' }

/**
 * Big Query Migration
 */
exports.bigQueryMigration = functions.runWith(runtimeOpts).https.onCall(async (data, context) => {
    const pubsub = new PubSub();

    await pubsub.topic('trigger-migration').publish(
        Buffer.from(JSON.stringify({ID: 'XXXX'}))
    );

    return 'BigQuery Migration: Done!';
});

/**
 * Big Query Truncate Table
 */
exports.bigQueryTruncateTable = functions.runWith(runtimeOpts).https.onCall(async (data, context) => {
    const bigquery = new BigQuery({projectId});

    const queryDeleteTable = {
        query: `TRUNCATE TABLE \`${projectId}.${datasetID}.${table}\``,
        location: 'US',
    }

    await bigquery.createQueryJob(queryDeleteTable);

    return 'BigQuery Table Clean Up: Done!';

});

/**
 * PubSub Topic
 */
exports.triggerFirebaseBigQueryMigration = functions.pubsub
    .topic('trigger-migration')
    .onPublish(async (message, context) => {
        const content = message.data ? Buffer.from(message.data, 'base64').toString() : null;
        if (typeof content === "string") {
            const messageBody = JSON.parse(content)

            if (messageBody && messageBody.ID) {
                const migrationData = [];

                // LOOP over Firebase data by messageBody.ID
                migrationData.push({
                    userId: 1,
                    type: 'agent',
                    timeStamp: Date.now(),
                });

                const bigquery = new BigQuery({projectId: appConfig.projectId});
                await bigquery
                    .dataset(datasetID)
                    .table(table)
                    .insert(migrationData)
            }
        }
    })
