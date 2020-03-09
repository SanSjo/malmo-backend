import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import mongoose from 'mongoose';

import gbgSkotrum from './data/gbgSkotrum.json';

const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost/skotrum-gbg';
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

const BabyRoomGbg = mongoose.model('BabyRoomGbg', {
  name: String,
  address: String,
  phone: String,
  openHours: String,
  note: String,
  website: String,
  latitude: Number,
  longitude: Number
});

if (process.env.RESET_DB) {
  const seedDatabase = async () => {
    await BabyRoomGbg.deleteMany();

    gbgSkotrum.forEach(restData => {
      new BabyRoomGbg(restData).save();
    });
  };
  seedDatabase();
}

// Defines the port the app will run on. Defaults to 8080, but can be
// overridden when starting the server. For example:
//
//   PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(bodyParser.json());

// Start defining your routes here
app.get('/', (req, res) => {
  res.send('Hello world');
});

app.get('/gbgBabyRooms', async (req, res) => {
  const gbgBabyRoom = await BabyRoomGbg.find();
  console.log(gbgBabyRoom);
  res.json(gbgBabyRoom);
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
