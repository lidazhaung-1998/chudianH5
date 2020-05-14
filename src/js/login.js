var $ = require('../libs/zepto')
var backIcon = require('../img/back.png')
var md5 = require('../libs/md5.js')
var BScroll = require('../libs/bscroll')
import "../css/login.scss"
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
    var username = 1
    var password = 1
    var md5String = "";
    var userName = "";
    var passWord = "";
    $('.login').tap(function () {
        userName = $('.username').val()
        passWord = $('.password').val()
        if (userName != username) {
            alert('账号有误')
        } else if (passWord != password) {
            alert('密码与账号不匹配')
        } else {
            md5String = md5(passWord);
            storageLoginStatus()
            var loginSuc = new LoginSuc()
            loginSuc.init() //从这里把20个账户密码传到构造函数中过去
        }
    })


    isLogin()

    function isLogin() {
        if (!cookie.get('pwd') && !cookie.get('account')) {
            return;
        }
        //已经登录在这里调用接口获取实际的APP手机号和密码
        var loginSuc = new LoginSuc()
        loginSuc.init() //从这里把20个账户密码传到构造函数中过去
    }



    function LoginSuc() {
        this.flag = false;
        this.arr = [{
                name: "xiao",
                text: "23-背景-背景",
                score: 20,
                weihui: 99
            },
            {
                name: "xiao挂",
                text: "23-北京-背景",
                score: 86,
                weihui: 0
            },
            {
                name: "xiao挂",
                text: "23-北京-背景",
                score: 86,
                weihui: 2
            },
            {
                name: "xiao挂",
                text: "23-北京-背景",
                score: 86,
                weihui: 0
            },
            {
                name: "xiao挂",
                text: "23-北京-背景",
                score: 86,
                weihui: 2
            },
            {
                name: "xiao挂",
                text: "23-北京-背景",
                score: 86,
                weihui: 2
            },
            {
                name: "xiao挂",
                text: "23-北京-背景",
                score: 86,
                weihui: 2
            },
            {
                name: "xiao挂",
                text: "23-北京-背景",
                score: 86,
                weihui: 2
            },
            {
                name: "xiao挂",
                text: "23-北京-背景",
                score: 86,
                weihui: 2
            },
            {
                name: "xiao挂",
                text: "23-北京-背景",
                score: 86,
                weihui: 2
            },
            {
                name: "xiao",
                text: "23-背景-背景",
                score: 20,
                weihui: 99
            },
            {
                name: "xiao挂",
                text: "23-北京-背景",
                score: 86,
                weihui: 2
            },
            {
                name: "xiao挂",
                text: "23-北京-背景",
                score: 86,
                weihui: 2
            },
            {
                name: "xiao挂",
                text: "23-北京-背景",
                score: 86,
                weihui: 2
            },
            {
                name: "xiao挂",
                text: "23-北京-背景",
                score: 86,
                weihui: 2
            },
            {
                name: "xiao挂",
                text: "23-北京-背景",
                score: 86,
                weihui: 2
            },
            {
                name: "xiao挂",
                text: "23-北京-背景",
                score: 86,
                weihui: 2
            },
            {
                name: "xiao挂",
                text: "23-北京-背景",
                score: 86,
                weihui: 2
            },
            {
                name: "xiao挂",
                text: "23-北京-背景",
                score: 86,
                weihui: 2
            },
            {
                name: "xiao挂",
                text: "23-北京-背景",
                score: 86,
                weihui: 0
            }
        ];
        this.arr1 = [{
                userid: "430022416"
            },
            {
                userid: "430159967"
            },
            {
                userid: "430035129"
            },
            {
                userid: "530035129"
            },
            {
                userid: "134564654"
            }
        ];
        this.userAccount = [] // 该数组存储  20个账户和密码
        this.userids = [] // 该数组存储  20个账户的userid
        this.userContentSelf = []
        this.init = function () {
            // 接受到传过来的20个账户密码并赋值
            this.getUserId()
            this.getuserContet()
            this.success()
            this.tapBack()
            this.Iscroll('.itemWrap')
            this.clickListItem()
        }
        // 遍历循环登录20个账户和密码
        this.getUserId = function () {
            var self = this;
            // 调用此处拿到20个账户id和meckeck
            // $.each(this.userAccount, function (index, item) {
            //     $.ajax({
            //         url: "http://cgi-user.evkeji.cn/mobileuser/user/phonelogin?", // 登录接口
            //         type: "POST",
            //         dataType: 'json',
            //         async: false,
            //         data: {
            //             phone: item.phone,
            //             password: item.password,
            //             _expire: new Date().getTime(),
            //             sign: "",
            //             logintype:"" ,
            //             code:"",
            //         },
            //         success: function (data) {
            //             self.userids.push(data.content.userid)
            //             拿到20个账号的“ id”
            //         }
            //     })
            // })
            this.userids = [430392564, 431294739, 431418282, 431820761, 430932358, 430699640, 430288131, 430325806, 430003799, 431448474, 430455137, 430014598,
                430022123, 430890595, 430015571, 431685336, 431423069, 430895562, 431276446, 430430172
            ]
        }

        // 拿到userid后调用查询用户资料，查询20个用户资料
        this.getuserContet = function () {
            var self = this;
            $.each(this.userids, function (index, userid) {
                $.ajax({
                    url: "http://cgi-base.evkeji.cn/sns/base/userinfo/gets?",
                    type: "POST",
                    dataType: "json",
                    async: false,
                    data: {
                        userIds: userid
                    },
                    success: function (data) {
                        console.log(data)
                        self.userContentSelf.push(data.content[userid])
                    }
                })
            })
        }
        this.success = function () {
            $('.title').html(` <div class="ListBack"><img src="${backIcon}" alt=""></div>
        账号列表`), $('.loginWrap').css('display', 'none');
            $('.itemWrap').css('display', 'block');
            this.renderList() //渲染账户列表html
        }
        this.tapBack = function () {
            var self = this
            $('.ListBack').tap(function () {
                self.reloadLogin()
            })
        }
        // 退出登录
        this.reloadLogin = function () {
            $('.title').html('账号登录'), $('.loginWrap').css('display', 'block');
            $('.itemWrap').css('display', 'none')
            cookie.remove('pwd')
            cookie.remove('account')
        }


        this.renderList = function () {
            var self = this;
            var accountHtml = "";
            $.each(this.userContentSelf, function (index, item) {
                accountHtml += ` <dl class="item border-1px EverylastBorderDone">
                <dd class="hiddenUserid" style="display:none;">${item.userId}</dd>
                <dd class="taskIcon" style="background-image:url(${item.head});">
                    <div class="hiddenHead" style="display:none;">${item.head}</div>
                </dd>
    
                <dd class="taskContent">
                    <div class="taskName">${item.nickname}</div>
                    <!-- taskName -->
                    <div class="taskContext">
                        <span class="message">${item.age} | ${item.job ? item.job : '暂无信息'} | 北京朝阳区</span>
                    </div>
                    <!-- taskContent -->
                </dd>
                <dd class="contentWrap">
                    <div class="redIcon">
                        ${self.haveWeidu(item)}
                        ${99}条未读
                        </div>
                    <div class="plusMoney">
                        积分 : <span class="num">${0}</span>
                    </div>
                    
                </dd>
            </dl>`
            })
            $('.itemWrap .content').html(accountHtml)
        }


        this.clickListItem = function () {
            var self = this;
            $('.content .item').tap(function () {
                var uid = $(this).find('.hiddenUserid').html()
                var nickname = encodeURIComponent($(this).find('.taskName').html())
                var myMSG = encodeURIComponent($(this).find('.message').html())
                var myHead = encodeURIComponent($(this).find('.hiddenHead').html())
                window.location.href = "http://192.168.25.126:8080/talk.html?uid=" + uid
                cookie.set('uid', uid, {
                    expire: 8
                })
                cookie.set('mcheck', md5('123456'), {
                    expire: 8
                })
                cookie.set('nickname', nickname, {
                    expire: 8
                })
                cookie.set('myMSG', myMSG, {
                    expire: 8
                })
                cookie.set('myHead', myHead, {
                    expire: 8
                })
            })
        }
        this.Iscroll = function (el) {
            var self = this;
            var bs = new BScroll(el)
            $('.itemWrap .content').on('touchmove', function () {
                if (bs.y >= 50) {
                    $('.loadMore').text('松开刷新...').css({
                        'font-size': '.33rem',
                        'height': (bs.y + 20) + 'px',
                        'line-height': (bs.y + 20) + 'px'
                    })
                } else {
                    self.loadMoreStyle('松开刷新...', {
                        "font-size": "0",
                        "height": "0"
                    }, 0)
                }
            })
            bs.on('touchEnd', function (pos) {
                if (pos.y >= 50) {
                    $('.content').html('')
                    self.userContentSelf = []
                    self.getuserContet()
                    self.renderList()
                    self.clickListItem()
                    self.loadMoreStyle('刷新成功', {
                        "font-size": "0",
                        "height": "0"
                    }, 500)

                }
            });

        }
        this.loadMoreStyle = function (text, opt, time) {
            $('.loadMore').text(text).animate(opt, time);
        }
        this.haveWeidu = function (item) {
            var have = ""
            if (item.weihui != 0) {
                have = '<div class="dian"></div>'
            } else {
                have = ""
            }
            return have
        }

    }

    function storageLoginStatus() {
        cookie.set('account', 'userName', {
            expire: 8
        })
        cookie.set('pwd', md5String, {
            expire: 8
        })
    }
})