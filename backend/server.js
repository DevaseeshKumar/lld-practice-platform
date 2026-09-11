require('dotenv').config();
const app = require('./app');
const { connectDB } = require('./config/db');
const { seedDatabase } = require('./config/seedData');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    const conn = await connectDB();
    if (conn) {
      await seedDatabase();
    } else {
      console.warn('[Server] Running without active MongoDB connection. (DB endpoints will fail until MongoDB is started)');
    }

    const server = app.listen(PORT, () => {
      console.log(`=========================================`);
      console.log(`[Server] LLD Practice Platform Server running`);
      console.log(`[Server] URL: http://localhost:${PORT}`);
      console.log(`[Server] Health: http://localhost:${PORT}/api/health`);
      console.log(`[Server] Problems: http://localhost:${PORT}/api/problems`);
      console.log(`=========================================`);
    });

    return server;
  } catch (error) {
    console.error('Fatal error during server startup:', error);
    process.exit(1);
  }
};

if (require.main === module) {
  startServer();
}

module.exports = { startServer };
