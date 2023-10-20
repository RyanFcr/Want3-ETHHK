const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const { Want } = require('../models');
/**
 * Upload a Want
 */
const UploadWant = async (wantBody) => {
  return Want.create(wantBody);
};

/**
 * GetWant(wanterAddr)   -> [{wantID, nftAddr, title,slogan, realizeValue, isRealized}]
 * @param {String} wanterAddr
 * @returns {Promise<Array<Object>>}
 */
const GetWant = async (wanterAddr) => {
  const query = Want.find({ wantAddr: wanterAddr });
  query.select('nftAddr title slogan realizeValue isRealized');
  const wants = await query.exec();
  const wantsWithId = wants.map((want) => {
    return {
      wantId: want._id,
      nftAddr: want.nftAddr,
      title: want.title,
      slogan: want.slogan,
      realizeValue: want.realizeValue,
      isRealized: want.isRealized,
    };
  });
  console.log(wantsWithId);
  return wantsWithId;
};

module.exports = {
  UploadWant,
  GetWant,
};
