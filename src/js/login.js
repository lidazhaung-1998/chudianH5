var $ = require('../libs/zepto')
var backIcon = require('../img/back.png')
var md5 = require('../libs/md5.js')
import "../css/login.scss"
import kkkk from "./kkkk"
var zuixin = []
document.onreadystatechange = completeLoading;

function completeLoading() {
    if (document.readyState == "complete") {
        $('.loading').css('display', 'none')
    } else {
        $('.loading').css('display', 'block')
    }
}
completeLoading()
$(function () {

    var cookie = {
        set: function (cookieKey, cookieValue, cookieOpts) {
            var arr = [];
            var d, t;
            var cfg = {
                'expire': null,
                'customExpire': null,
                'path': null,
                'domain': null,
                'secure': null,
                'encode': true
            };
            $.extend(cfg, cookieOpts);

            if (cfg.encode == true) {
                cookieValue = escape(cookieValue);
            }
            arr.push(cookieKey + '=' + cookieValue);

            if (cfg.path != null) {
                arr.push('path=' + cfg.path);
            }
            if (cfg.domain != null) {
                arr.push('domain=' + cfg.domain);
            }
            if (cfg.secure != null) {
                arr.push(cfg.secure);
            }
            if (cfg.expire != null) {
                d = new Date();
                t = d.getTime() + cfg.expire * 3600000; //cfg.expire * 1小时
                d.setTime(t);
                arr.push('expires=' + d.toGMTString());
            }
            if (cfg.customExpire != null) {
                arr.push('expires=' + cfg.customExpire.toGMTString());
            }
            document.cookie = arr.join(';');
        },
        get: function (cookieKey) {
            cookieKey = cookieKey.replace(/([\.\[\]\$])/g, '\\\$1');
            var rep = new RegExp(cookieKey + '=([^;]*)?;', 'i');
            var co = document.cookie + ';';
            var res = co.match(rep);
            if (res) {
                return res[1] || "";
            } else {
                return null;
            }
        },
        remove: function (cookieKey, cookieOpts) {
            cookieOpts = cookieOpts || {};
            cookieOpts.expire = -10;
            this.set(cookieKey, '', cookieOpts);
        }
    };
    var md5String = "";
    var userName = "";
    var passWord = "";
    var token = "";
    $('.login').tap(function () {
        userName = $('.username').val()
        if (userName != cookie.get('account')) {
            localStorage.setItem('isFirst', true)
        }
        passWord = $('.password').val()
        md5String = md5(passWord);

        isLoginSucc()
        storageLoginStatus()
    })

    function loginController() {
        var ControllerData = {}
        $.ajax({
            url: "http://121.46.195.211:13888/delegate/login?",
            type: "POST",
            dataType: "json",
            async: false,
            data: {
                username: userName || cookie.get('account'),
                password: md5String || cookie.get('pwd')
            },
            success: function (response) {
                // console.log(response)
                if (response.content) {
                    token = response.content.token;
                }
                ControllerData = response
            },
            error: function (err) {
                alert('服务器出了点小意外~')
            }
        })
        return ControllerData;
    }

    isLogin()

    function isLogin() {
        if (!cookie.get('pwd') && !cookie.get('account')) {
            return;
        }
        //已经登录在这里调用接口获取实际的APP手机号和密码
        isLoginSucc()
    }

    function isLoginSucc() {
        var response = loginController()
        if (response.state == 0) {
            var loginSuc = new LoginSuc()
            loginSuc.init(response.content.appAccounts) //从这里把20个账户密码传到构造函数中过去
        } else {
            alert(response.message)
        }
    }
    if (localStorage.getItem('isFirst') == "false") {
        localStorage.setItem('isFirst', false)
    } else {
        localStorage.setItem('isFirst', true)
    }


    function LoginSuc() {
        this.flag = false;
        this.userAccount = [] // 该数组存储  20个账户和密码
        this.userids = [] // 该数组存储  20个账户的userid
        this.userContentSelf = []
        this.mcheckArr = []
        this.scorce = []
        this.city = []
        this.auto = []
        this.index = 0;
        this.upDataArr = []
        this.getCityIndex = 0
        this.bb = JSON.parse(localStorage.getItem('bb')) || []
        this.init = function (arr) {
            var _this = this;
            this.userAccount = arr
            this.getuserContet()
            // this.getScorce()
            this.success()
            this.renderList()
            this.tapBack()
            // this.getCity()
            _this.callGetData() // TODO CALLDATA
            this.clickListItem()
            setTimeout(function () {
                kkkk.clearMaxLength(_this.userids, 100)
            }, 5000)
        }

        //存储账号id 和mcheck
        this.getuserContet = function (userid) {
            var _this = this;
            $.each(this.userAccount, function (idx, item) {
                _this.userids.push(item.userId)
            })
            $.ajax({
                url: "http://cgi-base.evkeji.cn/sns/base/userinfo/gets?",
                type: "POST",
                dataType: "json",
                async: false,
                data: {
                    userIds: _this.userids.join(',')
                },
                success: function (data) {
                    for (var i = 0; i < _this.userAccount.length; i++) {
                        var userId = _this.userAccount[i].userId;
                        var userMCheck = _this.userAccount[i].userMCheck;
                        var contentValue = data.content;
                        var userInfo = contentValue[userId];
                        _this.mcheckArr.push(userMCheck);
                        _this.userContentSelf.push(userInfo);
                    }
                }
            })
        }
        this.getScorce = function () {
            var self = this;
            $.each(this.userAccount, function (index, userContent) {
                $.ajax({
                    url: "http://cgi-vas.evkeji.cn/sns/cash/userpoint/get?",
                    type: "POST",
                    dataType: "json",
                    async: false,
                    data: {
                        userId: userContent.userId,
                        meck: userContent.userMCheck
                    },
                    success: function (req) {
                        // console.log(req)
                        self.scorce.push(req.content.balance)
                    }
                })
            })

        }

        this.success = function () {
            $('.title').html(` <div class="ListBack"><img src="${backIcon}" alt=""></div>账号列表`)
            $('.loginWrap').css('display', 'none');
            $('.itemWrap').css('display', 'block');
        }
        this.tapBack = function () {
            var self = this
            $('.ListBack').tap(function () {
                self.reloadLogin()
            })
        }



        this.renderList = function (item) {
            var self = this;
            var accountHtml = "";
            $.each(this.userContentSelf, function (index, item) {
                accountHtml += `<dl id="u${item.userId}" class="item border-1px EverylastBorderDone">
                <dd class="hiddenUserid" style="display:none;">${item.userId}</dd>
                        <dd class="taskIcon" style="background-image:url(${item.head});">
                            <div class="hiddenHead" style="display:none;">${item.head}</div>
                        </dd>
                        <dd class="taskContent">
                            <div class="taskName">${item.nickname}</div>
                            <!-- taskName -->
                            <div class="taskContext">
                                <span class="message">${item.age} | ${item.job ? item.job : '暂无信息'} </span>
                            </div>
                            <!-- taskContent -->
                        </dd>
                        <dd class="contentWrap">
                            <div class="redIcon">
                            <div class="dian"></div>
                                <span class="weiduMsg"></span>
                                </div>
                            <div class="plusMoney">
                                <!--积分 : <span class="num">${self.scorce[index]}</span>-->
                            </div>
                            
                        </dd>
                        <div class="hiddenMcheck" style="display:none;">${self.mcheckArr[index]}</div>
                        <div class="time" style="display:none;">0</div>
                        <div class="newId" style="display:none;">${zuixin[index] ? zuixin[index] : 0}</div>
                    </dl>`
            })
            // this.scorce = []
            $('.itemWrap .content').html(accountHtml)
            this.addRed()
        }
        this.FunSort = function (arr) {
            arr.sort(function (t1, t2) {
                var one = t1.querySelectorAll('.time')[0].innerText;
                var two = t2.querySelectorAll('.time')[0].innerText;
                if (one < two) {
                    return 1
                } else if (one == two) {
                    return 0
                } else {
                    return -1
                }
            })
            return arr
        }
        this.mySort = function (parent) {
            var newArr = [];
            var yepBack = [];
            var lastArr = [];
            // parent.forEach(function (item, index) {
            //     item.querySelectorAll('.dian')[0].getAttribute('style') == "display: block;" ? newArr.push(item) : yepBack.push(item);
            // })
            // var lastArr = this.FunSort(newArr).concat(this.FunSort(yepBack))
            parent.sort(function (num1, num2) {
                var td = $(num1).attr("time"); //querySelectorAll('.time')[0].innerText
                var td2 = $(num2).attr("time"); //querySelectorAll('.time')[0].innerText
                var dian1 = $(num1).find('.dian').css('display');
                var dian2 = $(num2).find('.dian').css('display');
                var n1 = dian1 == "block" ? 1 : 0;
                var n2 = dian2 == "block" ? 1 : 0;
                if (n2 == n1) {

                    if (td < td2) {
                        return 1
                    } else if (td == td2) {
                        return 0
                    } else {
                        return -1
                    }
                } else {
                    return n2 - n1;
                }



            })
            $('.content').html(parent)
        }
        this.list = function (all) {
            var cache = []
            for (var ar of all) {
                if (cache.find(c => c.sendid == ar.sendid && c.targetid == ar.targetid)) {
                    continue
                }
                cache.push(ar)
            }
            return cache
        }
        this.autoMsg = function () {
            var _this = this;
            var arr = this.auto
            var all = [];
            var userId = this.userAccount
            var storage = JSON.parse(localStorage.getItem('list')) || [];
            for (var i = 0; i < this.auto.length; i++) {
                for (var j = 0; j < arr[i].length; j++) {
                    if (arr[i][j].content.string_tp == "QI:FlatterMsg") {
                        all.push({
                            targetid: arr[i][j].content.int64_user_id,
                            sendid: arr[i][j].content.int64_target_user_id
                        })
                    }
                }
            }
            var list = _this.list(all)

            var lastStep = []
            for (var a of list) {
                if (storage.find(c => c.sendid == a.sendid && a.targetid == c.targetid)) {
                    continue
                }
                lastStep.push(a)
            }
            for (var k = 0; k < lastStep.length; k++) {
                var index = k;
                $.ajax({
                    url: "http://121.46.195.211:13888/delegate/res/quickreplylist/" + lastStep[index].sendid,
                    async: true,
                    type: "GET",
                    success: function (re) {
                        var msg = re.content[0]
                        var mcheck = ""
                        for (var i = 0; i < _this.userAccount.length; i++) {
                            if (_this.userAccount[i].userId == lastStep[index].sendid) {
                                mcheck = _this.userAccount[i].userMCheck
                            }
                        }
                        if (msg) {
                            // console.log(mcheck)
                            $.ajax({
                                url: "http://121.46.195.211:13888/delegate/msg/send/private/" + lastStep[index].sendid,
                                async: true,
                                data: {
                                    mcheck: mcheck,
                                    content: msg,
                                    targetId: lastStep[index].targetid
                                },
                                success: function (a) {
                                    // console.log(a)
                                }
                            })
                        }
                    }
                })
            }
            localStorage.setItem('list', JSON.stringify(list.concat(lastStep)))
        }
        this.colls = function (id, data) {
            var arrData = data.content;
            var tb = new Object();
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
                    tb[key] = colls
                }
                colls.push(item)
            })
            return tb
        }
        this.callGetData = function (t) {
            var _this = t || this;
            var userIds = _this.userids;
            var length = userIds.length;
            var len1 = length == 1 ? 1 : length / 2;
            var len2 = length;
            console.log(len1, len2)
            var callFunc1 = function (id, data, index) {

                if (index >= len1) {
                    _this.addRed()
                    setTimeout(function () {
                        _this.getData(_this, 0, callFunc1);
                    }, 1000);
                } else {
                    _this.getData(_this, index + 1, callFunc1);
                }
            }
            var callFunc2 = function (id, data, index) {
                //console.log("index:" + index)
                if (index >= len2) {
                    _this.addRed()
                    setTimeout(function () {
                        _this.getData(_this, len1, callFunc2);
                    }, 1000);
                } else {
                    _this.getData(_this, index + 1, callFunc2);
                }
            }

            if (len1 > 0) {
                this.getData(_this, 0, callFunc1);
            }

            if (len2 > 0) {
                this.getData(_this, len1, callFunc2);
            }

        }
        this.getData = function (t, index, callFunc) { // TODO DEFDATA
            var _this = t || this;
            //var id = _this.userids[_this.index]
            var id = _this.userids[index];

            $.ajax({
                url: "http://121.46.195.211:13888/delegate/msg/refresh/" + id + "?",
                type: "POST",
                async: true,
                dataType: "json",
                data: {
                    limit: 100,
                    targetId: "",
                    token: token,
                    lastId: 0
                },
                success: function (data) {
                    kkkk.updateReplyLastMsg(id, data)
                    // var createTime;
                    // if (data.content.length >= 1) {
                    //     if (data.content[0].content.int64_user_id != id) {
                    //         createTime = data.content[0].content.int64_time
                    //     } else {
                    //         createTime = 0
                    //     }
                    // } else {
                    //     createTime = 0
                    // }
                    // $("#u" + id).find('.time').html(createTime)
                    // _this.index++
                    // if (_this.index >= _this.userAccount.length) {
                    //     _this.addRed()
                    //     setTimeout(function () {
                    //         _this.getData(_this);
                    //     }, 3000);
                    // } else {
                    //     _this.getData();
                    // }
                    callFunc(id, data, index);
                }

            })
        }
        this.addRed = function (t) {
            var _this = t || this;
            var userIds = _this.userids;
            for (var i in userIds) {
                var userId = userIds[i];
                var state = kkkk.verifyReply(userId);
                // console.log(state)
                var dom = $('#u' + userId);
                if (state) {
                    // 没红点
                    dom.find('.dian').css('display', 'none')
                } else {
                    // 有红点
                    dom.find('.dian').css('display', 'block')
                }
                var recode = kkkk.getRecode(userId);
                var orderRecode = kkkk.getOrderRecode(userId, recode);
                if (orderRecode && orderRecode.length > 0) {
                    dom.attr("time", orderRecode[0].time);
                }

            }
            var items = $(".content .item");
            _this.mySort(items);
        }
        // this.getCity = function () {
        //     var _this = this;
        //     $.ajax({
        //         url: "http://cgi-base.evkeji.cn/sns/base/location/getLocation?",
        //         type: "POST",
        //         async: true,
        //         data: {
        //             userId: _this.userids[_this.getCityIndex],
        //             fromUserId: _this.userids[_this.getCityIndex]
        //         },
        //         success(data) {
        //             var address = data.content.province + data.content.city
        //             var id = data.content.userId
        //             var dom = $('#u' + id)
        //             var msgDom = dom.find('.message')
        //             var info = msgDom.html()
        //             var newText = info.substr(0, info.lastIndexOf('|'))
        //             newText = newText + address
        //             msgDom.html(newText)
        //             _this.getCityIndex++
        //             if (_this.getCityIndex >= _this.userids.length) {
        //                 _this.getCityIndex = 0
        //                 _this.getData()
        //                 return;
        //             } else {
        //                 _this.getCity()
        //             }
        //         }
        //     })
        // }
        this.getMsg = function () {
            var arr = [];
            var obj = {}
            zuixin = []
            var _this = this
            $.each(this.userAccount, function (idx, item) {
                $.ajax({
                    url: "http://121.46.195.211:13888/delegate/msg/refresh/" + item.userId + "?",
                    type: "POST",
                    async: true,
                    dataType: "json",
                    data: {
                        limit: 20,
                        targetId: "",
                        token: token,
                        lastId: 0
                    },
                    success: function (data) {
                        // console.log(data)
                        if (data.state != 0) {
                            alert('出错了~' + idx)
                        }
                        if (data.content.length) {
                            arr.push(data.content)
                            _this.auto.push(data.content)
                        }

                    }

                })
            })

            for (var i = 0; i < arr.length; i++) {
                zuixin.push(arr[i][0].id)
                $('.content .item .time').eq(i).html(arr[i][0].content.int64_time)
                if (la[i] != undefined) {
                    if (arr[i][0].id > la[i]) {
                        la[i] = arr[i][0].id
                        $('.content .item').each(function (index, item) {
                            if ($(this).find('.hiddenUserid').html() == arr[i][0].content.int64_target_user_id) {
                                var name = $(this).find('.taskName').html()
                                for (var l = 0; l < _this.bb.length; l++) {
                                    if (_this.bb[l].text.indexOf(name) != -1) {
                                        _this.bb[l].state = false
                                    }
                                }
                            }
                        })
                    }
                } else {
                    la.push(arr[i][0].id)
                }
                if (arr[i][0].content.int64_user_id != _this.userAccount[i].userId) {
                    if ((arr[i][0].id > _this.bb[i].id)) {
                        $('.content .item').each(function (ind, item) {
                            var name = $(this).find('.taskName').html()
                            if (_this.bb[i].text == name) {
                                _this.bb[i].state = false
                            }
                        })
                    }
                }

                for (var j = 0; j < arr[i].length; j++) {
                    if (arr[i][j].content.int64_target_user_id == _this.userAccount[i].userId) {
                        if (obj[arr[i][j].content.int64_target_user_id]) {
                            obj[arr[i][j].content.int64_target_user_id]++
                        } else {
                            obj[arr[i][j].content.int64_target_user_id] = 1
                        }
                    }

                }
            }
            localStorage.setItem('bb', JSON.stringify(_this.bb))
            // console.log(la)
        }
        this.clickListItem = function () {
            $('.content .item').tap(function () {
                var uid = $(this).find('.hiddenUserid').html()
                var nickname = encodeURIComponent($(this).find('.taskName').html())
                var myMSG = encodeURIComponent($(this).find('.message').html())
                var myHead = encodeURIComponent($(this).find('.hiddenHead').html())
                var myMcheck = $(this).find('.hiddenMcheck').html()
                // window.location.href = "http://123.57.87.160:80/cd/talk.html?uid=" + uid;
                window.location.href = `http://192.168.25.126:8080/talk.html?uid=${uid}`;
                cookie.set('uid', uid)
                cookie.set('mcheck', myMcheck)
                cookie.set('nickname', nickname)
                cookie.set('myMSG', myMSG)
                cookie.set('myHead', myHead)
                localStorage.setItem('num', $(this).index())
            })
        }
        this.loadMoreStyle = function (text, opt, time) {
            $('.loadMore').text(text).animate(opt, time);
        }
        // 退出登录
        this.reloadLogin = function () {
            $('.title').html('账号登录'), $('.loginWrap').css('display', 'block');
            $('.itemWrap').css('display', 'none')
            cookie.remove('pwd')
            cookie.remove('account')
        }
    }

    function storageLoginStatus() {
        cookie.set('account', userName)
        cookie.set('pwd', md5String)
        cookie.set('token', token)
    }
})



// for (i in json) {
//     var item = json[i];
//     var targetId = item.targetId;
//     var sendId = item.sendId;
//     var lId = 0;
//     var rId = 0;

//     if (targetId == userId) {
//         lId = targetId;
//         rid = sendId;
//     } else {
//         rId = targetId;
//         lid = sendId;
//     }
//     var key = lid + "-" + rId;
//     var colls = tb[key];
//     if (!colls) {
//         colls = [];
//         tb[key] = colls;
//     }
//     colls.push(item);
// }
// return tb;