const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const userValidation = require('../../validations/user.validation');
const wantController = require('../../controllers/want.controller');

const router = express.Router();

router
  .route('/want')
  .post(wantController.UploadWant)
  .get(wantController.GetWant);

router
  .route('/donate')
  .post(wantController.Donate)
  .get(wantController.GetDonation)

router
  .route('/share')
  .get(wantController.GetShareLink)

module.exports = router;
