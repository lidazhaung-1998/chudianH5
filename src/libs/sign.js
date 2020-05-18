
function getSign(param) { // 获取签名   返回一个包含"?"的参数串
var appKey = "sbkjCarWebBEIJING";
var securityKey = "2019sbkjCarWebBEIJINGsbkj";
var timeStamp = new Date().getTime();
// 判断是否有参数
if (param != null && param.length > 0) {
    param = "appKey=" + appKey + "&timeStamp=" + timeStamp + "&" + param;
} else {
    param = "appKey=" + appKey + "&timeStamp=" + timeStamp
}
return "?appKey=" + appKey + "&timeStamp=" + timeStamp + "&sign=" + calculateSign(param, securityKey);
}

// 生成sign
function calculateSign(param, securityKey) {
var params = param.split("&");
param = params.sort().join("").replace(/=/g, "");
console.info(param);
return sha1(param + securityKey).toUpperCase();
}