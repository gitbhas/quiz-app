import express from 'express';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

// Path to the JSON file where quiz results will be stored
const RESULTS_FILE = path.join(__dirname, 'quiz_results.json');

// Helper functions
async function initializeResultsFile() {
    try {
        await fs.access(RESULTS_FILE);
    } catch (error) {
        // File doesn't exist, create it with an empty array
        await fs.writeFile(RESULTS_FILE, JSON.stringify([]));
    }
}

async function readResults() {
    await initializeResultsFile();
    const data = await fs.readFile(RESULTS_FILE, 'utf8');
    return JSON.parse(data);
}

async function writeResults(results) {
    await fs.writeFile(RESULTS_FILE, JSON.stringify(results, null, 2));
}

// Save quiz results
app.post('/api/quiz/save', async (req, res) => {
    try {
        const { score, totalQuestions, userId, answers } = req.body;
        const results = await readResults();
        
        const newResult = {
            id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            score,
            totalQuestions,
            userId,
            answers,
            timestamp: new Date().toISOString()
        };
        
        results.push(newResult);
        await writeResults(results);
        
        res.json({ success: true, id: newResult.id });
    } catch (error) {
        console.error('Error saving quiz result:', error);
        res.status(500).json({ error: 'Failed to save quiz result' });
    }
});

// Get quiz results
app.get('/api/quiz/results', async (req, res) => {
    try {
        const userId = req.query.userId;
        let results = await readResults();
        
        // Filter by userId if provided
        if (userId) {
            results = results.filter(result => result.userId === userId);
        }
        
        // Sort by timestamp (newest first)
        results.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        
        res.json(results);
    } catch (error) {
        console.error('Error fetching quiz results:', error);
        res.status(500).json({ error: 'Failed to fetch quiz results' });
    }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});