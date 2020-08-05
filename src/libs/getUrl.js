function getqiqiUserId(str) {
    if (str) {
        str = str.split("?")[1];
        var arr = str.split("&");
        var obj = {};
        for (var i = 0; i < arr.length; i++) {
            var arr2 = arr[i].split("=");
            var key = arr2[0];
            var val = arr2[1];
            obj[key] = val;
        }
        if (obj.uid) {
            obj.userId = obj.uid
        } else if (obj.userId) {
            obj.userId = obj.userId
        } else if (obj.userid) {
            obj.userId = obj.userid
        }
        return obj
    } else {
        return {
            userId: 430015078
        }
    }
}
module.exports = getqiqiUserId