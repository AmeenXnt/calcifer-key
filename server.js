/*import express from 'express';
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
*/
const express = require('express');
const multer = require('multer');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 3000;

// SQLite Database
const db = new sqlite3.Database('./media.db');

// Create a table for storing media
db.serialize(() => {
  db.run("CREATE TABLE IF NOT EXISTS media (id INTEGER PRIMARY KEY AUTOINCREMENT, url TEXT NOT NULL)");
});

// Setup storage using multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// Upload route
app.post('/upload', upload.single('media'), (req, res) => {
  const filePath = req.file.path;
  const url = `https://${req.headers.host}/${filePath}`;

  // Save URL to database
  db.run("INSERT INTO media (url) VALUES (?)", [url], function(err) {
    if (err) {
      return res.status(500).json({ error: "Error saving to database" });
    }
    res.status(200).json({ message: "File uploaded successfully", url });
  });
});

// Serve static files
app.use('/uploads', express.static('uploads'));

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
