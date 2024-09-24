import express from 'express';
import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use('/uploads', express.static('uploads'));

app.post('/api/upload', async (req, res) => {
  const { mediaUrl } = req.body;

  if (!mediaUrl) {
    return res.status(400).json({ error: 'No media URL provided' });
  }

  try {
    const response = await fetch(mediaUrl);
    const buffer = await response.buffer();
    const fileName = `${Date.now()}-${path.basename(mediaUrl)}`;
    const uploadPath = path.join('uploads', fileName);

    fs.writeFileSync(uploadPath, buffer);

    const fileUrl = `https://${req.headers.host}/uploads/${fileName}`;
    res.status(200).json({ name: 'Ameen', url: fileUrl });
  } catch (error) {
    console.error('Error uploading file:', error);
    return res.status(500).json({ error: 'Error uploading file' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
