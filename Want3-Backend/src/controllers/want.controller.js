const catchAsync = require('../utils/catchAsync');
const httpStatus = require('http-status');
const { donateService, wantService } = require('../services');

const UploadWant = catchAsync(async (req, res) => {
  const want = await wantService.UploadWant(req.body);
  res.send(want);
});

const GetWant = catchAsync(async (req, res) => {
  const { wantAddr } = req.query;
  const wants = await wantService.GetWant(wantAddr);
  res.send(wants);
});




const GetDonation = catchAsync(async (req, res) => {
  const { donaterAddr } = req.query;
  const donations = await donateService.GetDonation(donaterAddr);
  res.send(donations);
});

const Donate = catchAsync(async (req, res) => {
  console.log('donate');
  const { wantId, donaterAddr, value, message } = req.body;
  await donateService.UploadDonate(wantId, donaterAddr, value, message);
  // res.status(httpStatus.OK).json({ success: true });
  res.send('want');
});

const GetShareLink = catchAsync(async (req, res) => {
  res.send(req);
});

module.exports = {
  UploadWant,
  GetWant,
  GetDonation,
  Donate,
  GetShareLink,
};
