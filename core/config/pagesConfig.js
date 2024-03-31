/* 
 * 页面路由表对象：
 * 该文件挂载在Vue
 * 配置参数项说明： 
 * key:必填配置 
 * name:可选配置 （路由名称）
 * path:必填配置 （路由地址）
 * requiresAuth:可选配置 （是否权限路由）
 */
export default{
	// tabbar
	index: {
		key: "index",
		name: "首页",
		path: "/pages/main/index/index"
	},
	ranklist: {
		key: "ranklist",
		name: "大神榜",
		path: "/pages/rank/ranklist"
	},
	market: {
		key: "market",
		name: "积分商城",
		path: "/pages/pointsmarket/market"
	},
	profile: {
		key: "profile",
		name: "我的",
		path: "/pages/main/profile/profile"
	},
	login:{
		key: "login",
		name: "登录/注册",
		path: "/pages/user/login/login"
	},
	phoneLogin:{
		key: "phoneLogin",
		name: "手机登录",
		path: "/pages/user/login/phoneLogin"
	},
	captcha:{
		key: "captcha",
		name: "验证码",
		path: "/pages/user/login/captcha"
	},
	set:{
		key: "set",
		name: "设置",
		path: "/pages/user/set/set"
	},
	collect: {
		key: "collect",
		name: "收藏",
		path: "/pages/user/collect/collect",
		requiresAuth: true
	},
	address: {
		key: "address",
		name: "收货地址",
		path: "/pages/user/address/address",
		requiresAuth: true
	},
	addressManage: {
		key: "addressManage",
		name: "地址编辑",
		path: "/pages/user/address/manage",
		requiresAuth: true
	},
	game:{
		key: "game",
		name:"游戏主界面",
		path:"/pages/game/game"
	},
	machine:{
		key: "machine",
		name:"机器列表",
		path:"/pages/game/machine"
	},
	integral:{
		key: "integral",
		name: "积分明细",
		path: "/pages/user/account/integral/detail",
		requiresAuth: true
	},
	dollBag:{
		key: "dollBag",
		name: "娃娃背包",
		path: "/pages/user/doll/dollBag",
		requiresAuth: true
	},
	myDollDetail: {
		key: "myDollDetail",
		name: "娃娃详情",
		path: "/pages/user/doll/detail",
	},
	bill:{
		key: "bill",
		name: "金币明细",
		path: "/pages/user/account/bill/bill",
		requiresAuth: true
	},
	gamerecord:{
		key: "gamerecord",
		name: "游戏记录",
		path: "/pages/user/gamerecord/gamerecord",
		requiresAuth: true
	},
	complaint:{
		key: "complaint",
		name: "游戏申诉",
		path: "/pages/user/gamerecord/complaint",
		requiresAuth: true
	},
	userInfo:{
		key: "userInfo",
		name: "个人资料",
		path: "/pages/user/account/userInfo/userInfo"
	},
	bindMobile: {
		key: "bindMobile",
		name: "绑定手机号",
		path: "/pages/user/account/bindMobile/bindMobile",
	},
	recharge: {
		key: "recharge",
		name: "充值中心",
		path: "/pages/pay/recharge",
		requiresAuth: true
	},
	productDetail: {
		key: "productDetail",
		name: "积分产品详情",
		path: "/pages/pointsmarket/detail",
	},
	order: {
		key: "order",
		name: "我的订单",
		path: "/pages/order/order",
		requiresAuth: true
	},
	orderDetail: {
		key: "orderDetail",
		name: "订单详情",
		path: "/pages/order/orderDetail",
		requiresAuth: true
	},
	shipping: {
		key: "shipping",
		name: "物流信息",
		path: "/pages/order/shipping",
		requiresAuth: true
	},
	exchangePwd: {
		key: "exchangePwd",
		name: "口令红包",
		path: "/pages/sub/exchangePwd",
		requiresAuth: true
	},
	message: {
		key: "message",
		name: "消息中心",
		path: "/pages/sub/message",
		requiresAuth: true
	},
	distribution: {
		key: "distribution",
		name: "推广中心",
		path: "/pages/distribution/distribution",
		requiresAuth: true
	},
	withdraw: {
		key: "withdraw",
		name: "申请提现",
		path: "/pages/distribution/withdraw",
		requiresAuth: true
	},
	withdrawRecord: {
		key: "withdrawRecord",
		name: "提现记录",
		path: "/pages/distribution/withdrawRecord",
		requiresAuth: true
	},
	myDistribution: {
		key: "myDistribution",
		name: "我的推广",
		path: "/pages/distribution/myDistribution",
		requiresAuth: true
	},
	poster: {
		key: "poster",
		name: "邀请好友",
		path: "/pages/user/poster/poster",
		requiresAuth: true
	},
	brokerageCapital: {
		key: "brokerageCapital",
		name: "佣金明细",
		path: "/pages/distribution/brokerageCapital",
		requiresAuth: true
	},
	webview: {
		key: "webview",
		name: "浏览器",
		path: "/pages/public/webview/webview",
	},
	article: {
		key: "article",
		name: "文章",
		path: "/pages/public/article",
	},
	popup:{
		key: "popup",
		name:"弹出页",
		path:"/pages/popup/popup"
	},
	dollDetail:{
		key: "dollDetail",
		name:"娃娃详情页",
		path:"/pages/game/dollDetail"
	},
	search:{
		key: "search",
		name:"搜索",
		path:"/pages/public/search/search"
	},
	discover:{
		key: "discover",
		name:"社区",
		path:"/pages/main/discover/discover"
	}
}