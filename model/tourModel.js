const mongoose = require('mongoose');
const slugify = require('slugify');

const tourSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'], //validators
      unique: true,
      trim: true //trim as in strings in JS
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration']
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size']
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have difficulty'],
      trim: true
    },
    ratingAverage: {
      type: Number,
      default: 4.5
    },
    ratingsQuantity: {
      type: Number,
      default: 0
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price']
    },
    priceDiscount: Number,
    summary: {
      type: String,
      trim: true, //trim as in strings in JS
      required: [true, 'A tour must have a description']
    },
    description: {
      type: String,
      trim: true
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a cover image']
    },
    image: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false //this is to prevent a certain field from showing
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

//In Mongoose, virtual properties are fields that are not stored in MongoDB but are computed on the fly when you query documents. These are useful for deriving values from existing fields.
tourSchema.virtual('durationWeeks').get(function() {
  return this.duration / 7;
});

//DOCUMENT MIDDLEWARE?
//Runs before .save() and .create() but not insertMany() command
//aka pre save hook/middleware
tourSchema.pre('save', function(next) {
  this.slug = slugify(this.name, { lower: true });
  //this keyword point to the current document
  next();
});

// tourSchema.pre('save', function(next) {
//   console.log('will save document...');
//   next();
// });

// //aka post save hook/middleware
// tourSchema.post('save', function(doc, next) {
//   console.log(doc);
//   next();
// });

//QUERY MIDDLEWARE?
// Query middleware in Mongoose allows you to run functions before (pre) or after (post) a query is executed. This is useful for modifying queries, adding filters, logging, or performing actions before/after a query runs.

// tourSchema.pre('find', function(next) {
//this regexp will find any thing that starts with find
tourSchema.pre(/^find/, function(next) {
  this.find({ secretTour: { $ne: true } });
  //this keyword point to the current query
  this.start = Date.now();
  next();
});

tourSchema.post(/^find/, function(docs, next) {
  console.log(`Query took ${Date.now() - this.start} milliseconds`);
  console.log(docs);
  next();
});

tourSchema.pre('aggregate', function(next) {
  //this keyword point to current aggregation object
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });

  console.log(this.pipeline());
  next();
});

//AGGREGATION MIDDLEWARE?
//Aggregation middleware in Mongoose allows you to modify aggregation pipelines before execution. It is useful for adding filters, logging, or transforming data in aggregation queries.
const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
