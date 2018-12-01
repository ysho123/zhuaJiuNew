/**
 * 判断是否抽取过本次活动
 */
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
  let {ac_id} = event ;
  let openId = event.userInfo.openId ;

  let joinRes = await db.collection('joinLog').where({
    ac_id: ac_id,
    userOpenId: openId
  }).get();

  let myLog = joinRes.data[0] || null;

  if (myLog){
    return {
      code : 1
    }
  }else{
    return {
      code : 0 
    }
  }

}