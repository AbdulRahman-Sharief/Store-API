const Product = require('../models/product');

exports.getAllProductsStatic = async (req, res) => {
  const products = await Product.find({}).sort('price').select('name price');
  res.status(200).json({
    status: 'success',
    results: products.length,
    data: {
      products,
    },
  });
};
exports.getAllProducts = async (req, res) => {
  const { featured, name, company, sort, fields, numericFilters } = req.query;
  const queryObj = {};
  if (featured) queryObj.featured = featured === 'true' ? true : false;
  if (name) queryObj.name = { $regex: name, $options: 'i' };
  if (company) queryObj.company = company;
  if (numericFilters) {
    const operatorMap = {
      '>': '$gt',
      '>=': '$gte',
      '=': '$eq',
      '<': '$lt',
      '<=': '$lte',
    };
    const regEx = /\b(<|>|>=|=|<|<=)\b/g;
    const filters = numericFilters.replace(
      regEx,
      (match) => `-${operatorMap[match]}-`
    );
    const options = ['price', 'rating'];
    filters = filters.split(',').forEach((el) => {
      const [field, operator, value] = el.split('-');
      if (options.includes(field))
        queryObj[field] = { [operator]: Number(value) };
    });
  }
  let query = Product.find(queryObj);
  // sort
  if (sort) {
    const sortList = sort.split(',').join(' ');
    query = query.sort(sortList);
  } else {
    query = query.sort('createdAt');
  }

  if (fields) {
    const fieldsList = fields.split(',').join(' ');
    query = query.select(fieldsList);
  }
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  query = query.skip(skip).limit(limit);
  const products = await query;

  res.status(200).json({
    status: 'success',
    results: products.length,
    data: {
      products,
    },
  });
};
