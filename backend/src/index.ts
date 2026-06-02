import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initDb } from './db';
import { initCache } from './cache';
import urlRoutes from './routes/urls';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// All URL routes — note /:shortCode is here too for redirects
app.use('/api', urlRoutes);
app.use('/', urlRoutes); // for redirect: GET /:shortCode

async function start() {
  await initDb();
  await initCache();
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

start().catch(console.error);
