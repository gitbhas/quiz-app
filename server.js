const express = require('express');
const { saveQuizResult, getQuizResults } = require('./src/utils/db');

const app = express();
app.use(express.json());

// Save quiz results
app.post('/api/quiz/save', async (req, res) => {
    try {
        const { score, totalQuestions } = req.body;
        const id = await saveQuizResult(score, totalQuestions);
        res.json({ success: true, id });
    } catch (error) {
        console.error('Error saving quiz result:', error);
        res.status(500).json({ error: 'Failed to save quiz result' });
    }
});

// Get quiz results
app.get('/api/quiz/results', async (req, res) => {
    try {
        const results = await getQuizResults();
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