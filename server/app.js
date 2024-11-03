import express from 'express';
import bodyParser from 'body-parser';
// eslint-disable-next-line import/no-extraneous-dependencies
import cors from 'cors'; // Import the cors package
import router from './routes/routes.js';

const app = express();

// Use cors to allow all origins
app.use(cors()); // This will allow all origins

app.use(bodyParser.json());
app.use(router);

export default app;
