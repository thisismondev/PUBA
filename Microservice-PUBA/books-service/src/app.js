import express from 'express';

const app = express();

app.use(express.json());

// routes

// global error handler
// app.use(errorHandler);

export default app;
