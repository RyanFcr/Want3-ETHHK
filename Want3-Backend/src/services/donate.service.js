const { Want,Donate} = require('../models');
const ApiError = require("../utils/ApiError");
const httpStatus = require("http-status");


const UploadDonate = async (wantId, donaterAddr, value, message) => {
  try {
    if (!Want.findOne({_id: wantId})){
        return false
    }
    // 创建 Donate 对象
    const donate = new Donate({
      donaterAddr,
      message,
      value,
    })

    console.log(donate)
    // 保存 Donate 对象到数据库
    await donate.save();

    const query = Want.findById( wantid );
    query.select('nftAddr slogan realizeValue isRealized');
    const want = await query.exec();
    const newValue = want.realizeValue + Number(value);
    const updatedWant = await Want.updateOne(
      { _id: want._id },
      {
        realizeValue: newValue,
      }
    );
    // 在此处编写其他逻辑，例如与 Buy 相关的操作
    return true; // 返回 Donate 成功
  } catch (error) {
    console.error('Error occurred while saving donate:', error);
    throw new Error('Donate failed');
  }
};

const GetDonation = async (donaterAddr) => {
  try {

    // 查询符合 donaterAddr 的捐赠记录
    const donations = await Donate.find({ donaterAddr:donaterAddr });
    console.log("donations")
    // 提取相关字段信息
    const result = donations.map((donation) => ({
      donaterAddr: donaterAddr,
      message: donation.message,
      value: donation.value,
    }));

    return result; // 返回捐赠记录的信息
  } catch (error) {
    console.error('Error occurred while saving donate:', error);
    throw new Error('Donate failed');
    // throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to get donation');
  }
};

module.exports = {
  UploadDonate,
  GetDonation
};


