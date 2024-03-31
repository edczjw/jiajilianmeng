import $mHelper from './helper';
import $pagesConfig from '../config/pagesConfig';
import $pagesAuditConfig from '../config/pagesAuditConfig';
import $mTabbarConfig from '../config/tabbarConfig'
import $mStore from '@/store';

/* 
 * 路由对象
 * 中心思想：需要路由鉴权,由于uni-app没有vue中的全局钩子函数，所以封装了Router对象。
 * 说明：应用中的路由跳转尽量使用该Router的方法，并配合config中的路由表对象进行跳转。
 * 如果在tabbarConfig中配置了tabbar页面，则switchTab方法可以不使用，这样可以尽量灵活
 * 
 * 示例：this.$api.router.push({route:this.$api.routesConfig.index,query:{a:1}})
 * 
 */
class Router {
	constructor(arg) {
		this.callBack = () => {};
	}
	
	beforeEach(callBack) {
		if (callBack instanceof Function) this.callBack = callBack;
	}
	
	checkSwitchTab(to){
		let isSwitchTab=false;
		for(let i=0;i<$mTabbarConfig.tabbarList.length;i++){
			let configTabberPage = $mTabbarConfig.tabbarList[i]
			if(configTabberPage.pagePath==to.route.path && configTabberPage.jumpType=="switchTab"){
				isSwitchTab = true;
				break;
			}
		}
		return isSwitchTab;
	}

	push(to) {
		if(this.checkSwitchTab(to)){
			to = this.getAuditPath(to);
			this.switchTab(to);
		}else{
			to = this.getAuditPath(to);
			this.callBack("navigateTo", to);
		}
	}

	redirectTo(to) {
		if(this.checkSwitchTab(to)){
			to = this.getAuditPath(to);
			this.switchTab(to);
		}else{
			to = this.getAuditPath(to);
			this.callBack("redirectTo", to);
		}
	}
	
	getAuditPath(to) {
		if($mStore.state.isAudit){
			// console.log(to);
			if(to.route && to.route.key){
				let route = $pagesAuditConfig[to.route.key];
				// console.log(route);
				if(route && route.path){
					to.route.path = route.path;
				}
			}
		}
		// console.log(to);
		return to
	}

	reLaunch(to) {
		this.callBack("reLaunch", to);
	}

	switchTab(to) {
		this.callBack("switchTab", to);
	}

	back(delta) {
		uni.navigateBack({
			delta
		})
	}
}

const $mRouter = new Router();

//路由请求
$mRouter.beforeEach((navType, to) => {
	if (to.route === undefined){
		console.log("路由钩子函数中没有找到to.route对象，路由信息:" + JSON.stringify(to));
		return;
	}

	// 过滤需要权限的页面
	if (to.route.requiresAuth) {
		if ($mStore.getters.hasLogin) {
			// 已经登录
			uni[navType]({
				url: $mHelper.objParseUrlAndParam(to.route.path, to.query)
			})
		} else {
			uni[navType]({
				url: $pagesConfig.login.path,
				animationType: "slide-in-bottom"
			})
		}
	} else {
		uni[navType]({
			url: $mHelper.objParseUrlAndParam(to.route.path, to.query)
		})
	}
})

export default $mRouter;
