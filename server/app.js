import express from 'express';
import cors from 'cors';
import router from './routes/homeRoutes.js';

const app = express();
app.use(cors());
app.use(express.json());

// Use routes
app.use(router);

const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});