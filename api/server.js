import express from 'express'
import cors from 'cors'
import axios from 'axios'
import * as cheerio from 'cheerio'
import dotenv from 'dotenv';
import cors from 'cors';




dotenv.config();

const app = express()
const PORT = 5000
const key = process.env.YOUTUBE_API_KEY;

app.use(cors({
  origin: 'https://comment-picker-frontend.vercel.app',
}));
app.use(express.json()) 

function getVideoId(url) {
  const regex = /(?:v=|\.be\/)([^&\n?#]+)/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

app.post('/', async (req, res) => {
  const { link } = req.body;

  if (!link) {
    return res.status(400).json({ error: 'Missing YouTube video link' });
  }

  const videoId = getVideoId(link);

  if (!videoId) {
    return res.status(400).json({ error: 'Invalid YouTube video link' });
  }

  try {
    const response = await axios.get(
      `https://www.googleapis.com/youtube/v3/commentThreads`,
      {
        params: {
          part: 'snippet',
          videoId: videoId,
          maxResults: 100 , // You can increase up to 100
          key: key,
        },
      }
    );

    const comments = response.data.items.map((item) => ({
      author: item.snippet.topLevelComment.snippet.authorDisplayName,
      text: item.snippet.topLevelComment.snippet.textDisplay,
      link: `https://www.youtube.com/watch?v=${videoId}&lc=${item.id}`
    }));

    res.json(comments);
  } catch (err) {
    console.error('Error fetching comments:', err.message);
    res.status(500).json({ error: 'Failed to fetch comments' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
