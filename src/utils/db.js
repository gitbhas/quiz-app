import AWS from 'aws-sdk';

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
        console.log('Table already exists');
    } catch (error) {
        if (error.code === 'ResourceNotFoundException') {
            console.log('Creating new DynamoDB table...');
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
            await dynamodbAdmin.createTable(params).promise();
            console.log('Table created successfully');
            // Wait for the table to be active
            await dynamodbAdmin.waitFor('tableExists', { TableName: TABLE_NAME }).promise();
        } else {
            throw error;
        }
    }
}

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

// Initialize the database when this module is loaded
initializeDatabase()
    .then(() => console.log('Database initialization complete'))
    .catch(err => console.error('Failed to initialize database:', err));

export {
    saveQuizResult,
    getQuizResults,
    initializeDatabase  // Export this in case we need to call it explicitly
};