// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'real-7ac34f'
})
const db = cloud.database({
  env: 'real-7ac34f'
});

// 云函数入口函数
exports.main = async (event, context) => {
  let res = await db.collection('shenhe').doc('W__GgCfIZl09sR_S').get();

  return res
}