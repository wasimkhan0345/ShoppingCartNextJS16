// pages/api/upload.js
import upload from '../../lib/multer';

export const config = {
  api: {
    bodyParser: false, // Important: disable bodyParser
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  upload.single('image')(req, res, (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    res.status(200).json({
      message: 'File uploaded successfully',
      file: req.file,
    });
  });
}