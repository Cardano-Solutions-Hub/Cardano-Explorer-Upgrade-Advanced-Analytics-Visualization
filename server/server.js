import { config } from 'dotenv';
import server from './app.js';

// read dotenv file
const envPath = `${process.cwd()}/.env`;
config({ path: envPath });

// shutdown the server if there is uncaught exception
process.on('uncaughtException', (err) => {
  console.log(err);
  console.log('UNCAUGHT EXCEPTION!! * Shutting down ...');
  process.exit(1);
});

const { PORT } = process.env || 5000;

// start the server
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

// shutodwn the server if there is unhandled rejection
process.on('unhandledRejection', (err) => {
  console.log(err);
  console.log('UNHANDLED REJECTION!!! * Shutting down ...');
  process.exit(1);
});
