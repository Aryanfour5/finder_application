const express = require('express');
const axios = require('axios'); // For HTTP requests
const cors = require('cors');  // To handle cross-origin requests

const app = express();
app.use(cors());
app.use(express.json()); // Parse JSON body

// Route to interact with Flask API
app.post('/api/summarize', async (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: 'No text provided' });
  }

  let retries = 3; // Retry up to 3 times for reliability
  while (retries > 0) {
    try {
      // Forward the request to Flask API
      const flaskResponse = await axios.post('http://127.0.0.1:5000/summarize', { text });
      return res.json(flaskResponse.data); // Return Flask response to frontend
    } catch (error) {
      console.error(`Retrying... Attempts left: ${retries - 1}`);
      retries--;
      if (retries === 0) {
        return res.status(500).json({ error: 'Failed to summarize text after multiple attempts' });
      }
    }
  }
});

// Start the server
const PORT = 5001;
app.listen(PORT, () => {
  console.log(`Express backend running on http://localhost:${PORT}`);
});
