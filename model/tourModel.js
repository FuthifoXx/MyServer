const mongoose = require('mongoose');

const tourSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'], //validators
      unique: true,
      trim: true //trim as in strings in JS
    },
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
    startDates: [Date]
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

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
