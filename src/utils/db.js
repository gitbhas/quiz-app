const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const db = new sqlite3.Database(path.join(__dirname, 'quiz.db'), (err) => {
    if (err) {
        console.error('Error connecting to database:', err);
    } else {
        console.log('Connected to SQLite database');
        initializeDatabase();
    }
});

function initializeDatabase() {
    db.run(`
        CREATE TABLE IF NOT EXISTS quiz_results (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            score INTEGER NOT NULL,
            total_questions INTEGER NOT NULL,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);
}

function saveQuizResult(score, totalQuestions) {
    return new Promise((resolve, reject) => {
        const query = `
            INSERT INTO quiz_results (score, total_questions)
            VALUES (?, ?)
        `;
        
        db.run(query, [score, totalQuestions], function(err) {
            if (err) {
                reject(err);
            } else {
                resolve(this.lastID);
            }
        });
    });
}

function getQuizResults() {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT * FROM quiz_results
            ORDER BY timestamp DESC
        `;
        
        db.all(query, [], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
}

module.exports = {
    saveQuizResult,
    getQuizResults
};