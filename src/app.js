const express = require('express');
const env = require('dotenv');
const cors = require('cors');
const mongoose = require('mongoose');

env.config();
const port = process.env.PORT;
const app = express();

app.use(cors());
app.use(express.json());
mongoose
  .connect(
    'mongodb+srv://iirfanansarii:NRv1dtKbMHQYg77g@cluster0.9l86r.mongodb.net/dev?authSource=admin&replicaSet=atlas-edmn0k-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true',
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  )
  .then(() => {
    console.log('Database Connected');
  });

const userRouter = require('./api/router/user-rotuer');
const postRouter = require('./api/router/post-router');

app.use('/api', userRouter);
app.use('/api', postRouter);

app.listen(port || 5000, () => {
  console.log(`App is listenin on port ${port}`);
});
