// app.js
import express from 'express';

const app = express();
const PORT = 3000;

// Serve static frontend
app.use(express.static('views'));

// Sample API endpoint
app.get('/api/data', (req, res) => {
  // Replace this with real logic (API call or ML output)
  res.json({ labels: ['A', 'B', 'C'], values: [10, 20, 15] });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});