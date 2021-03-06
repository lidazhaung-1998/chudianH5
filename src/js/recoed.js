/*
    
    1 调用接口获取用户消息日志时，每个用户的消息返回后调用函数
      updateReplyLastMsg(userId, data); 进行刷新缓存。

    2 向消息队列（任务队列）添加任务，每隔一段时间执行，校验用户的红点，并操作dom位置。
      获取userIds (用户ID集合) 循环调用 verifyReply(userId)
      返回 true false，如果是true，则没有红点，假有红点，并且将当前dom节点置顶。

    3 向消息队列（任务队列）添加任务 每隔一段时间执行，用于清理超过长度的列表。
      调用 clearMaxLength(userIds, 100);


      login.js 调用 1 2 3 
      talk 调用 1 3
*/


/**
    @param userId 我的ID 例如 1111
    @return 获得当前用户记录的缓存 
    结果：
    {
        "1111-3333": msgItem,
        "1111-4444": msgItem
    }
*/

function getRecode(userId) {
    var recodeKey = "ulast" + userId;
    // 获得当前这个账户的记录
    var recode = JSON.parse(localStorage.getItem(recodeKey));
    if (!recode) {
        recode = {};
    }
    return recode;
}

function setRecode(userId, recode) {
    var recodeKey = "ulast" + userId;
    localStorage.setItem(recodeKey, JSON.stringify(recode));
}

function getBlackList(uid) {
    var balckKey = "u-black" + uid;
    var b_recode = JSON.parse(localStorage.getItem(balckKey));
    if (!b_recode) {
        b_recode = {};
    }
    return b_recode;
}

function setBlackList(uid, b_recode) {
    var balckKey = "u-black" + uid;
    var b_recode = localStorage.setItem(balckKey, JSON.stringify(b_recode));
}

function removeOneTalkList(id, removeId) {
    var b_recode = getBlackList(id);
    var removeKey = id + "-" + removeId;
    if (!Object.keys(b_recode).length) {
        b_recode[removeKey] = true;
        setBlackList(id, b_recode);
    }
    for (key in b_recode) {
        if (key.indexOf(removeKey) == -1) { //没有
            b_recode[removeKey] = true;
            setBlackList(id, b_recode);
        }
    }
}

function getOrderRecode(userId, recode) {
    var sortlist = [];
    var b_recode = getBlackList(userId);
    for (key in recode) {
        var userId1 = userId;
        var userId2 = userId;
        var recv = false;
        var content = recode[key].content;
        if (userId == content.int64_target_user_id) {
            userId2 = content.int64_user_id;
            recv = true;
        } else {
            userId2 = content.int64_target_user_id;
            recv = false;
        }
        var item = {
            "key": key,
            "time": recode[key].content.int64_time,
            "userId1": userId1,
            "userId2": userId2,
            "recv": recv,
        };
        if (!b_recode[key]) {
            sortlist.push(item);
        }
    }
    
    // 排序
    sortlist.sort(function (o1, o2) {
        var num1 = o1.time;
        var num2 = o2.time;
        if (num2 > num1) {
            return 1;
        } else if (num2 == num1) {
            return 0;
        } else {
            return -1;
        }
    });
    return sortlist;
}

function msgType(content, uid) {
    if (content.int64_user_id == uid) {
        return '已回复';
    }
    if (content.string_tp == "QI:FlatterMsg") {
        return '搭讪消息';
    } else if (content.string_tp == "RC:VcMsg") {
        return "语音消息";
    } else if (content.string_tp == "RC:ImgMsg") {
        return "图片";
    } else if (content.string_tp == "RC:SightMsg") {
        return "视频消息";
    } else if (content.string_tp == "RC:TxtMsg") {
        return content.msg_user_private.string_content;
    } else if (content.string_tp == "QI:GiftMsg") {
        return "收到了对方送出的礼物";
    } else if (content.string_tp == "RC:GIFMsg") {
        return "(动画表情)";
    }
}

/** 更新记录最后一条回复的消息
 *  
 * @param userId 要更新的用户-登陆的后的某个子运营账户
 * @param data   当前用户的所有日志
 */
function updateReplyLastMsg(userId, data) {
    var tb = group(userId, data);
    // 获得当前这个账户的记录
    var recode = getRecode(userId);
    /*
        {
            "11111-33333":[{},{}],
            "11111-55555":[item1]
            "11111-33333": {}
        }   
    */
        for (var key in tb) {
           var list = tb[key]; // key = 11111-33333 val = {}
           var item = list[0]; // 最新的
           var prev = recode[key];
           if (!prev || prev.id < item.id) {
            recode[key] = item;
        }
    }
    // 将记录覆盖
    setRecode(userId, recode);
}

function updateReplyLastMsgOne(userId, data) {
    var tb = group(userId, data);
    // 获得当前这个账户的记录
    var recode = getRecode(userId);
    /*
        {
            "11111-33333":[item0],
            "11111-55555":[item1]
        }   
    */
    for (var key in tb) {
        var list = tb[key]; // key = 11111-33333 val = {}
        var item = list[list.length - 1]; // 最新的
        var prev = recode[key];
        if (!prev || prev.id < item.id) {
            recode[key] = item;
        }
    }
    // 将记录覆盖
    setRecode(userId, recode);
}

/**
 * 验证是否全部回复
 * @param userId 子运营账户ID
 * @return true 全部回复 false 未全部回复
 */
function verifyReply(userId) {
    // 获得当前这个账户的记录
    var recode = getRecode(userId);
    for (var key in recode) {
        var item = recode[key];
        if (item.content.int64_user_id != userId) {
            return false;
        }
    }
    return true;
}



/**
 * 清理超过最大长度的用户。只保留 一部分数据
 * @param userIds 所有子账户ID集合
 * @param size 保留多少个用户
 */

function clearMaxLength(userIds, size) {
    for (var i in userIds) {
        var userId = userIds[i];
        var recode = getRecode(userId);
        var len = Object.keys(recode);
        if (len.length < size) {
            // 1 排序得到按照接受时间倒序 [11111-33333, 11111-44444]
            var sortlist = [];
            for (var key in recode) {
                var item = {
                    "key": key,
                    "time": recode[key].content.int64_time
                };
                sortlist.push(item);
            }
            // 排序
            sortlist.sort(compare("tiem"));
            for (var i = size; i < sortlist.length; i++) {
                var key = sortlist[i].key;
                delete recode[key];
            }
        }
        setRecode(userId, recode);
    }
}

function compare(key) {
    return function (o1, o2) {
        var num1 = o1[key];
        var num2 = o2[key];
        if (num2 > num1) {
            return 1;
        } else if (num2 == num1) {
            return 0;
        } else {
            return -1;
        }
    }
}

function group(id, data) {
    var arrData = data.content;
    var tb = new Object();
    if (!arrData || arrData.length == 0) {
        return tb;
    }
    arrData.forEach(function (item, index) {
        var targetId = item.content.int64_target_user_id;
        var sendId = item.content.int64_user_id;
        var lId = 0;
        var rId = 0;
        if (targetId == id) {
            lId = targetId;
            rId = sendId;
        } else {
            lId = sendId;
            rId = targetId;
        };
        var key = lId + '-' + rId;
        var colls = tb[key];
        if (!colls) {
            colls = [];
            tb[key] = colls;
        }
        colls.push(item);
    })
    return tb;
} 
module.exports = {
    group,
    clearMaxLength,
    verifyReply,
    updateReplyLastMsg,
    getRecode,
    getOrderRecode,
    msgType,
    updateReplyLastMsgOne,
    removeOneTalkList
}