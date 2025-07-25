import express from 'express';

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());
