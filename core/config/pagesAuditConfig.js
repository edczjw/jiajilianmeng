/* 
 * 审核页面路由表对象：
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
		name: "审核首页",
		path: "/pages/audit/index"
	},
	recharge: {
		key: "recharge",
		name: "审核充值中心",
		path: "/pages/audit/recharge",
		requiresAuth: true
	},
	login:{
		key: "login",
		name: "审核登录",
		path: "/pages/audit/login"
	},
}