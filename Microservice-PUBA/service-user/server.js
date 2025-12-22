require('dotenv').config();
const express = require('express');
const cors = require('cors');
const router = require('./app');

const app = express();
const port = process.env.PORT || 3000;

// Enable CORS for frontend
app.use(cors({
  origin: 'http://localhost:3003',
  credentials: true,
}));

app.use(express.json());
app.use(router);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
