const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Parse JSON bodies
app.use(express.json());

// API endpoint to get initial stock prices (for future enhancement)
app.get('/api/prices', (req, res) => {
    res.json({
        AAPL: 150.00,
        GOOGL: 2800.00,
        MSFT: 330.00,
        AMZN: 3300.00,
        TSLA: 250.00
    });
});

// API endpoint for trading (placeholder for future backend integration)
app.post('/api/trade', (req, res) => {
    const { symbol, quantity, type } = req.body;

    // Validate request
    if (!symbol || !quantity || !type) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    // In a real app, this would process the trade through a database
    res.json({
        success: true,
        message: `${type} order placed for ${quantity} shares of ${symbol}`,
        timestamp: new Date().toISOString()
    });
});

// Serve index.html for all other routes (SPA support)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`Trading Platform server is running on http://localhost:${PORT}`);
});
