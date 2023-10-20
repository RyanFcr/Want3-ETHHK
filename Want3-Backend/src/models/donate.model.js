const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const { toJSON, paginate } = require('./plugins');
const { roles } = require('../config/roles');

const donateSchema = mongoose.Schema(
  {
    donaterAddr: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    value: {
      type: Number,
      required: true,
      default: 0
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
donateSchema.plugin(toJSON);
donateSchema.plugin(paginate);

/**
 * @typedef Donate
 */
const Donate = mongoose.model('Donate', donateSchema);

module.exports = Donate;
