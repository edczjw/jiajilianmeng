//页面混合数据方法
import $mMixin from './utils/mixin/mixin';

//全局存储
import $mStore from '@/store';

//全局请求
import $mHttp from './utils/http';

//全局方法
import $mGraceChecker from './utils/graceChecker';
import $mHelper from './utils/helper';
import $mAppUpdate from './utils/appUpdate';
import $mComponents from './utils/components';
import $mThrottle from './utils/throttle';
import $mWwj from './utils/wwj';
//路由
import $mRouter from './utils/router';

//内置即时通讯
import $mSocket from './utils/socket';

//微信公众号SDK
// #ifdef H5
import $mJweixin from './utils/jweixin';
// #endif

//配置
import $mApiConfig from './config/apiConfig';
import $mAppConfig from './config/appConfig';
import $mAssetsConfig from './config/assetsConfig';
import $mResponseCode from './config/responseCode';
import $mPagesConfig from './config/pagesConfig';
import $mSocketioConfig from './config/socketioConfig';
import $mDataConfig from './config/dataConfig';
import $mTheme from './config/theme';
import $mTabbarConfig from './config/tabbarConfig';
import $mLanguageConfig from './config/languageConfig';
import $mEventConfig from './config/eventConfig';
import $mZIndex from './config/zIndex';
import $animation from '@/core/utils/animation'
//网络状态监听
uni.getNetworkType({
	success: function(res) {
		$mStore.dispatch("networkStateChange", res.networkType);
	}
})

uni.onNetworkStatusChange(function(res) {
	$mStore.dispatch("networkStateChange", res.networkType);
})

//全局挂载
const api = {
	store: $mStore,
	apiConfig:$mApiConfig,
	appConfig: $mAppConfig,
	assetsConfig: $mAssetsConfig,
	responseCode: $mResponseCode,
	pagesConfig: $mPagesConfig,
	socketioConfig: $mSocketioConfig,
	dataConfig: $mDataConfig,
	graceChecker: $mGraceChecker,
	helper: $mHelper,
	components: $mComponents,
	throttle: $mThrottle,
	router: $mRouter,
	http: $mHttp,
	socket: $mSocket,
	appUpdate: $mAppUpdate,
	theme:$mTheme,
	tabbarConfig: $mTabbarConfig,
	language: $mLanguageConfig,
	zIndex: $mZIndex,
	// #ifdef H5
	jweixin: $mJweixin,
	// #endif
	systemInfo: uni.getSystemInfoSync(),
	mixin:$mMixin,
	wwj:$mWwj,
	animation:$animation,
	eventConfig:$mEventConfig
}
//挂载到uni对象
uni.$api = api

const install = Vue => {
	Vue.mixin($mMixin);
	Vue.filter('timeFormat', (timestamp, format = 'yyyy-mm-dd hh:MM') => {
		return $mHelper.timeFormat(timestamp, format);
	})
	Vue.filter('timeFrom', (timestamp, format = 'yyyy-mm-dd hh:MM') => {
		return $mHelper.timeFrom(timestamp, format);
	})
	//#ifndef APP-NVUE
	Vue.prototype.$api = api;
	Vue.prototype.$onLaunched = new Promise(resolve => {
	    Vue.prototype.$isResolve = resolve
	})
	//#endif
}

export default {
	install
}
