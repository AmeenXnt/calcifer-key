import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { imageUrl } = req.body;

    if (!imageUrl) {
      return res.status(400).json({ error: 'No image URL provided' });
    }

    try {
      const response = await fetch(imageUrl);
      const buffer = await response.buffer();
      const fileName = `${Date.now()}-${path.basename(imageUrl)}`;
      const uploadPath = path.join('uploads', fileName);

      fs.writeFileSync(uploadPath, buffer);

      const fileUrl = `https://${req.headers.host}/uploads/${fileName}`;
      res.status(200).json({ 
        name: "Ameen", 
        url: fileUrl 
      });
    } catch (error) {
      console.error('Error uploading file:', error);
      return res.status(500).json({ error: 'Error uploading file' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
