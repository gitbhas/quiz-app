const AWS = require('aws-sdk');

// Configure AWS SDK
AWS.config.update({
    region: process.env.AWS_REGION || 'us-east-1'
});

const dynamodb = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = process.env.DYNAMODB_TABLE || 'quiz-results';

// Initialize DynamoDB table
async function initializeDatabase() {
    const dynamodbAdmin = new AWS.DynamoDB();
    try {
        await dynamodbAdmin.describeTable({ TableName: TABLE_NAME }).promise();
        console.log('DynamoDB table already exists');
    } catch (err) {
        if (err.code === 'ResourceNotFoundException') {
            const params = {
                TableName: TABLE_NAME,
                KeySchema: [
                    { AttributeName: 'id', KeyType: 'HASH' }
                ],
                AttributeDefinitions: [
                    { AttributeName: 'id', AttributeType: 'S' }
                ],
                ProvisionedThroughput: {
                    ReadCapacityUnits: 5,
                    WriteCapacityUnits: 5
                }
            };
            try {
                await dynamodbAdmin.createTable(params).promise();
                console.log('Created DynamoDB table');
            } catch (createErr) {
                console.error('Error creating table:', createErr);
            }
        } else {
            console.error('Error checking table:', err);
        }
    }
}

// Initialize the database when the module loads
initializeDatabase();

async function saveQuizResult(score, totalQuestions) {
    const timestamp = new Date().toISOString();
    const id = `${timestamp}_${Math.random().toString(36).substr(2, 9)}`;
    
    const params = {
        TableName: TABLE_NAME,
        Item: {
            id,
            score,
            total_questions: totalQuestions,
            timestamp
        }
    };

    try {
        await dynamodb.put(params).promise();
        return id;
    } catch (err) {
        console.error('Error saving quiz result:', err);
        throw err;
    }
}

async function getQuizResults() {
    const params = {
        TableName: TABLE_NAME,
        ScanIndexForward: false
    };

    try {
        const data = await dynamodb.scan(params).promise();
        return data.Items.sort((a, b) => b.timestamp.localeCompare(a.timestamp));
    } catch (err) {
        console.error('Error getting quiz results:', err);
        throw err;
    }
}

module.exports = {
    saveQuizResult,
    getQuizResults
};