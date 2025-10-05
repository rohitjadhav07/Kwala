const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const bodyParser = require('body-parser');
require('dotenv').config();

const kwalaRoutes = require('./routes/kwala');
const questRoutes = require('./routes/quests');
const tournamentRoutes = require('./routes/tournaments');
const characterRoutes = require('./routes/characters');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(morgan('combined'));
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:3000',
    process.env.PRODUCTION_URL || 'https://chainquest-demo.vercel.app'
  ],
  credentials: true
}));

// Body parsing middleware
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    kwala: {
      connected: !!process.env.KWALA_API_KEY,
      workspace: process.env.KWALA_WORKSPACE_ID || 'not_configured'
    }
  });
});

// API Routes
app.use('/api/kwala', kwalaRoutes);
app.use('/api/quests', questRoutes);
app.use('/api/tournaments', tournamentRoutes);
app.use('/api/characters', characterRoutes);

// Kwala webhook endpoints (special handling for security)
app.use('/webhooks', require('./routes/webhooks'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 ChainQuest Backend running on port ${PORT}`);
  console.log(`🤖 Kwala Integration: ${process.env.KWALA_API_KEY ? '✅ Configured' : '❌ Not configured'}`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;