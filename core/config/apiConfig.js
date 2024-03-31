import appConfig from "./appConfig.js"

const PATH = appConfig.apiDomain;

//api接口定义
export default{
	//手机验证码登陆
	phoneLoginUrl:PATH + '/user/login',
	//wx登陆
	wxLoginUrl:PATH + '/user/wxlogin',
	//苹果登陆
	appleLoginUrl:PATH + '/user/applelogin',
	//游客登陆
	visitorLoginUrl:PATH + '/user/visitorlogin',
	//获取用户信息
	getUserInfoUrl:PATH + '/user/info',
	//发送手机验证码
	sendPhoneCode:PATH + '/user/sendCode',
	
	getCategories:PATH + '/doll/categories',
	
	getDollList:PATH + '/doll/dollList',
	
	getAllDollList:PATH + '/doll/list',
	//检查机器状态
	checkMachineStatus:PATH + '/machine/checkMachineStatus',
	//收藏机器
	collectMachine:PATH + '/user/collectMachine',
	
	getIndexBanner:PATH + '/banner?dataVersion=0',
	getBanner:PATH + '/banner/',
	
	serverConf:PATH + '/conf.json',
	//最近抓到的玩家
	catchSuccessRecent:PATH + '/machine/catchSuccessRecent',
	
	machineListUrl:PATH + '/machine/list/',
	//获取用户收藏列表
	getCollectList:PATH + '/user/collectList',
	//获取用户地址列表
	getAddressList:PATH + '/address/list',
	//添加地址
	addAddress:PATH + '/address/add',
	//修改地址
	updateAddress:PATH + '/address/edit',
	//删除地址
	delAddress:PATH + '/address/del',
	//积分明细
	integralRecord:PATH + '/user/jifenRecordList',
	//金币明细
	billRecord:PATH + '/user/coinRecordList',
	//用户推广信息
	extendInfo:PATH + '/user/extendInfo',
	//申请提现提示信息
	withdrawTip:PATH + '/user/withdrawTip',
	//申请提现
	withdraw:PATH + '/user/withdraw',
	//我的推广列表
	extendUserList:PATH + '/user/extendUserList',
	//佣金明细
	commissionList:PATH + '/user/commissionList',
	//提现记录
	withdrawList:PATH + '/user/withdrawList',
	//积分产品分类
	productCategory:PATH + '/shop/categories',
	//积分产品列表
	productList:PATH + '/shop/list',
	//app版本更新
	appVersionUpdate:PATH+ '/client/checkVersion',
	//绑定手机号
	bindPhone:PATH + '/user/bindPhone',
	//排行榜
	rankList:PATH + '/user/weekRankList',
	//积分产品详情
	getProductDetail:PATH + '/shop/detail/',
	//积分产品兑换
	productExchange:PATH + '/shop/exchange',
	//召唤小哥摆娃娃
	callPutDoll:PATH + '/machine/callPutDoll',
	//订单列表
	orderList:PATH + '/order/list',
	//订单详情
	orderDetail:PATH + '/order/detail/',
	//获取充值选项
	getRechargeOptions:PATH + '/payment/rechargeOptions',
	//获取充值方式
	getPayMethodList:PATH + '/payment/methodList',
	//检查订单状态
	checkOrderStatus:PATH + '/payment/checkOrder/',
	//我的娃娃
	myDollList:PATH + '/user/myDollList',
	//兑换积分
	exchangeJifen:PATH + '/doll/exchangeJifen',
	//申请发货
	applyDeliver:PATH + '/doll/applyDeliver',
	getRecordDetail:PATH + '/user/getRecordDetail/',
	//ios web支付
	webpayForm:PATH + '/payment/webpayForm',
	//支付
	pay:PATH + '/payment/pay',
	//ios内购
	iosInappRecharge:PATH + '/payment/iosInappRechargeNotify',
	//兑换口令
	exchangePwd:PATH + '/market/exchangePwd',
	//获取文章
	getArticle:PATH + '/article/',
	//游客登录
	visitorLogin:PATH + '/user/visitorlogin',
	//苹果登录
	appleLogin:PATH + '/user/applelogin',
	//微信登录
	wxLogin:PATH + '/user/wxlogin',
	//游戏记录
	gameRecordList:PATH + '/user/gameRecordList',
	//提交申诉
	submitComplaint:PATH + '/user/submitComplaint',
	//OSS
	ossCredit:PATH + '/oss/getCredit',
	//娃娃搜索
	search:PATH + '/doll/search',
	//获取在线客服链接
	getOnlineCustomerUrl:PATH + '/onlineCustomer',
	pages:PATH + '/pages/',
	//注销账号
	logOff:PATH + '/user/logOff',
	getInviteUrl: PATH + '/user/inviteUrl',
	
	
	
	
	
	
	
	
	
	
	/* //手机验证码登陆
	phoneLoginUrl:PATH + '/wwj/apple/yonghu/login',
	//wx登陆
	wxLoginUrl:PATH + '/wwj/apple/yonghu/wxlogin',
	//苹果登陆
	appleLoginUrl:PATH + '/wwj/apple/yonghu/applelogin',
	//游客登陆
	visitorLoginUrl:PATH + '/wwj/apple/yonghu/visitorlogin',
	//获取用户信息
	getUserInfoUrl:PATH + '/wwj/apple/yonghu/info',
	//发送手机验证码
	sendPhoneCode:PATH + '/wwj/apple/yonghu/sendCode',
	
	getCategories:PATH + '/wwj/apple//wawa/categories',
	
	getDollList:PATH + '/wwj/apple//wawa/dollList',
	
	getAllDollList:PATH + '/wwj/apple//wawa/list',
	//检查机器状态
	checkMachineStatus:PATH + '/wwj/apple//jiqi/checkMachineStatus',
	//收藏机器
	collectMachine:PATH + '/wwj/apple/yonghu/collectMachine',
	
	getIndexBanner:PATH + '/banner?dataVersion=0',
	getBanner:PATH + '/wwj/apple/peizhi/banner/',
	
	serverConf:PATH + '/wwj/apple/peizhi/peizhi.json',
	//最近抓到的玩家
	catchSuccessRecent:PATH + '/wwj/apple//jiqi/catchSuccessRecent',
	
	machineListUrl:PATH + '/wwj/apple//jiqi/list',
	//获取用户收藏列表
	getCollectList:PATH + '/wwj/apple/yonghu/collectList',
	//获取用户地址列表
	getAddressList:PATH + '/wwj/apple/dizhiguanli/list',
	//添加地址
	addAddress:PATH + '/wwj/apple/dizhiguanli/add',
	//修改地址
	updateAddress:PATH + '/wwj/apple/dizhiguanli/edit',
	//删除地址
	delAddress:PATH + '/wwj/apple/dizhiguanli/del',
	//积分明细
	integralRecord:PATH + '/wwj/apple/yonghu/jifenRecordList',
	//金币明细
	billRecord:PATH + '/wwj/apple/yonghu/coinRecordList',
	//用户推广信息
	extendInfo:PATH + '/wwj/apple/yonghu/extendInfo',
	//申请提现提示信息
	withdrawTip:PATH + '/wwj/apple/yonghu/withdrawTip',
	//申请提现
	withdraw:PATH + '/wwj/apple/yonghu/withdraw',
	//我的推广列表
	extendUserList:PATH + '/wwj/apple/yonghu/extendUserList',
	//佣金明细
	commissionList:PATH + '/wwj/apple/yonghu/commissionList',
	//提现记录
	withdrawList:PATH + '/wwj/apple/yonghu/withdrawList',
	//积分产品分类
	productCategory:PATH + '/wwj/apple//shangcheng/categories',
	//积分产品列表
	productList:PATH + '/wwj/apple//shangcheng/list',
	//app版本更新
	appVersionUpdate:PATH+ '/wwj/apple/peizhi/client/vvso',
	//绑定手机号
	bindPhone:PATH + '/wwj/apple/yonghu/bindPhone',
	//排行榜
	rankList:PATH + '/wwj/apple/yonghu/weekRankList',
	//积分产品详情
	getProductDetail:PATH + '/wwj/apple//shangcheng/detail/',
	//积分产品兑换
	productExchange:PATH + '/wwj/apple//shangcheng/exchange',
	//召唤小哥摆娃娃
	callPutDoll:PATH + '/wwj/apple//jiqi/callPutDoll',
	//订单列表
	orderList:PATH + '/wwj/apple//dingdan/list',
	//订单详情
	orderDetail:PATH + '/wwj/apple//dingdan/detail/',
	//获取充值选项
	getRechargeOptions:PATH + '/wwj/apple//zhifu/rechargeOptions',
	//获取充值方式
	getPayMethodList:PATH + '/wwj/apple//zhifu/methodList',
	//检查订单状态
	checkOrderStatus:PATH + '/wwj/apple//zhifu/checkOrder/',
	//我的娃娃
	myDollList:PATH + '/wwj/apple/yonghu/myDollList',
	//兑换积分
	exchangeJifen:PATH + '/wwj/apple//wawa/exchangeJifen',
	//申请发货
	applyDeliver:PATH + '/wwj/apple//wawa/applyDeliver',
	getRecordDetail:PATH + '/wwj/apple/yonghu/getRecordDetail/',
	//ios web支付
	webpayForm:PATH + '/wwj/apple//zhifu/webpayForm',
	//支付
	pay:PATH + '/wwj/apple//zhifu/pay',
	//ios内购
	iosInappRecharge:PATH + '/wwj/apple//zhifu/iosInappRechargeNotify',
	//兑换口令
	exchangePwd:PATH + '/market/exchangePwd',
	//获取文章
	getArticle:PATH + '/wwj/apple/wenzhang/',
	//游客登录
	visitorLogin:PATH + '/wwj/apple/yonghu/visitorlogin',
	//苹果登录
	appleLogin:PATH + '/wwj/apple/yonghu/applelogin',
	//微信登录
	wxLogin:PATH + '/wwj/apple/yonghu/wxlogin',
	//游戏记录
	gameRecordList:PATH + '/wwj/apple/yonghu/gameRecordList',
	//提交申诉
	submitComplaint:PATH + '/wwj/apple/yonghu/submitComplaint',
	//OSS
	ossCredit:PATH + '/oss/getCredit',
	//娃娃搜索
	search:PATH + '/wwj/apple//wawa/search',
	//获取在线客服链接
	getOnlineCustomerUrl:PATH + '/onlineCustomer',
	pages:PATH + '/wwj/apple/peizhi/pages/', */
}