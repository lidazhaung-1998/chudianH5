import "../css/index.scss";
import "./page/home/home"
import Login from  "./page/login/login"
var $ = require('../libs/zepto')
$('.app').html(Login.Login)
Login.caozuoLogin()