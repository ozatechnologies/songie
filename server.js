// server.js

const express = require('express');
const bodyParser = require('body-parser');
const musicbrainz = require('./musicbrainz'); // Assuming musicbrainz.js is in the same folder

const app = express();
app.use(bodyParser.raw({ type: 'audio/wav', limit: '10mb' }));

app.post('/recognize', async (req, res) => {
  try {
    const audioData = req.body;
    const result = await musicbrainz.recognizeMusic(audioData);
    res.json(result);
  } catch (error) {
    console.error('Error during recognition:', error);
    res.status(500).json({ error: 'Failed to recognize music' });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
