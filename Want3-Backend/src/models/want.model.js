const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const wantSchema = mongoose.Schema(
  {
    wantAddr: {
      type: String,
      required: true,
      trim: true,
    },
    nftAddr: {
      type: String,
      required: true,
      trim: true,
    },
    // add title
    title: {
      type: String,
      required: true,
      trim: true,
      default: ""
    },
    slogan: {
      type: String,
      required: true,
      trim: true,
      default: ""
    },
    realizeValue: {
      type: Number,
      required: true,
      default: 0
    },
    isRealized: {
      type: Boolean,
      require: true,
      default: false,
    }
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
wantSchema.plugin(toJSON);
wantSchema.plugin(paginate);

/**
 * @typedef Want
 */
const Want = mongoose.model('Want', wantSchema);

module.exports = Want;
