import express from 'express';
import * as path from 'path';

import encodeRouter from './routes/encode.route';
import decodeRouter from './routes/decode.route';
import createCredentialRouter from './routes/create-credential.route';

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // To parse the incoming requests with JSON payloads

app.use('/assets', express.static(path.join(__dirname, 'assets')));

// Mount the routers
app.use('/encode', encodeRouter);
app.use('/decode', decodeRouter);
app.use('/create-credential', createCredentialRouter);

const port = process.env.PORT || 3001;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});
server.on('error', console.error);
