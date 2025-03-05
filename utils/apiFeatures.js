class APIFeatures {
  //mongoose query and a queryString from the route
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    // const queryObj = { ...req.query }; from this
    const queryObj = { ...this.queryString }; //to this
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach(el => delete queryObj[el]);

    //1B) Advanced filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

    // let query = Tour.find(JSON.parse(queryStr));from this
    this.query = this.query.find(JSON.parse(queryStr)); //to this
    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }
    return this;
  }

  limitingFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      // query = query.select('name duration price'); //this is called projecting
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v'); //the minus is for excluding a field
    }
    return this;
  }

  paginate() {
    //page=2&limit=10, [1->10, page1] [11->20, page2] [21-> 30, page3]
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 100;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}
module.exports = APIFeatures;
