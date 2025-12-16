require('dotenv').config();
const express = require('express');
const router = require('./app');

const app = express();
const port = 3000;

app.use(express.json());
app.use(router);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
