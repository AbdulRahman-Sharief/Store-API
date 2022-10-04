const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/product');
const fs = require('fs');

dotenv.config({
  path: './config.env',
});

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
    console.log('DB connected Sucessfully!');
  }
);

const products = JSON.parse(
  fs.readFileSync(`${__dirname}/products.json`, 'utf-8')
);
console.log(products);
const importData = async () => {
  try {
    await Product.create(products);
    console.log(`DATA LOADED SUCCESSFULLY!`);
  } catch (err) {
    console.log(err.message);
  }
  process.exit();
};

const deleteData = async () => {
  try {
    await Product.deleteMany();
    console.log(`DATA DELETED SUCCESSFULLY!`);
  } catch (err) {
    console.log(err.message);
  }
  process.exit();
};

if (process.argv[2] === '--import') importData();
if (process.argv[2] === '--delete') deleteData();
