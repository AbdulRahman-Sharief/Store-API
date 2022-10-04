const mongoose = require('mongoose');
const dotenv = require('dotenv');

process.on('uncaughtException', (err) => {
  console.log(err.name, err.message);
  console.log(err);
  console.log(`UNCAUGHT EXCEPTION !💥, Shutting down ...`);
  process.exit(1);
});

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace(
  '<password>',
  process.env.DATABASE_PASSWORD
);

mongoose.connect(
  DB,
  {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  },
  () => {
    console.log('DB connected Successfully');
  }
);

const app = require('./app');
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App is running on ${port}...`);
});

process.on('unhandeledRejection', (err) => {
  console.log(err.name, err.message);
  console.log(`UNHANDELED REJECTION !💥, Shutting down ...`);
  server.close(() => {
    process.exit(1);
  });
});
