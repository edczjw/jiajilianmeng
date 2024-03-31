import Vue from 'vue'
import Vuex from 'vuex'

import $mAppConfig from '@/core/config/appConfig'
import $mTabbarConfig from '@/core/config/tabbarConfig'
import $mPagesConfig from '@/core/config/pagesConfig'
import $mRouter from '@/core/utils/router'
import $mhelper from '@/core/utils/helper'

Vue.use(Vuex);

const EMPTY = {
	accessToken: "",
	userInfo: {},
	lastLoginTime: 0,
	jumpUpdateVersion: "",
	dollSearch: [],
	productSearchDefault: "",
	productSearchHot: [],
	bagNum: 0,
	customerTheme:'',
	lastCaptchaTimeStamp:0,
	lastInputMobile:'',
	lastSelectMobileArea:$mAppConfig.mobileArea,
	styleLoadingType: 'loading-1',
	popupAdvTime: 0,//弹出广告时间
	isAgree: true,//  控制服务协议显示
	isGuide: true, // 控制引导页显示
	isPopAdv: 0, // 控制是否首次点击弹窗
	signinTime: '' ,// 签到时间
	isAudit:true //控制审核版本
};
const CACHE = uni.getStorageSync('appCache') || EMPTY;

const store = new Vuex.Store({
	state:{
		clientVersion: '',
		appCache:CACHE,
		accessToken:CACHE.accessToken,
		socketHadLogin:false,
		userInfo:CACHE.userInfo,
		lastLoginTime:CACHE.loginTime,
		//娃娃历史搜索
		dollSearch: CACHE.dollSearch,
		//默认搜索关键字
		productSearchDefault: CACHE.productSearchDefault,
		//热门搜索
		productSearchHot: CACHE.productSearchHot,
		//背包数量
		bagNum:CACHE.bagNum,
		customerTheme:CACHE.customerTheme,
		lastCaptchaTimeStamp:CACHE.lastCaptchaTimeStamp,
		lastInputMobile:CACHE.lastInputMobile,
		lastSelectMobileArea:CACHE.lastSelectMobileArea,
		styleLoadingType: CACHE.styleLoadingType,
		//首页弹出广告时间
		popupAdvTime: CACHE.popupAdvTime,
		// 控制服务协议显示
		isAgree: CACHE.isAgree,
		// 控制引导页显示
		isGuide: CACHE.isGuide,
		// 控制是否首次点击弹窗
		isPopAdv: CACHE.isPopAdv,
		// 签到时间
		signinTime: CACHE.signinTime,
		//网络状态
		networkState: 'unknown',
		serverConf:{},
		offsetTime:0,
		lastEnterMachine:null,
		lastLookDoll:null,
		gameSet:CACHE.gameSet || {volume: true},
		isAudit: true
	},
	getters:{
		// 用户是否登录
		hasLogin: state => {
			if (state.accessToken) {
				return true
			} else {
				return false
			}
		},
		historyDollSearch: state=>{
			if($mhelper.isEmpty(state.dollSearch)){
				let appCache = uni.getStorageSync("appCache");
				return appCache.dollSearch;
			}else{
				return state.dollSearch;
			}
		}
	},
	mutations:{
		login(state, params){
			state.appCache.accessToken = state.accessToken = params.token;
			uni.setStorageSync("appCache", state.appCache);
		},
		logout(state){
			state.appCache.accessToken = state.accessToken = "";
			state.appCache.userInfo = state.userInfo = {};
			uni.setStorageSync("appCache", state.appCache);
		},
		setClientVersion(state, params){
			state.clientVersion = params;
		},
		setUserInfo(state, params){
			state.appCache.userInfo = state.userInfo = params;
			uni.setStorageSync("appCache", state.appCache);
		},
		setDollSearch(state, params) {
			state.appCache.dollSearch = state.dollSearch = params;
			uni.setStorageSync("appCache", state.appCache);
		},
		setProductSearchDefault(state, params) {
			state.appCache.productSearchDefault = state.productSearchDefault = params;
			uni.setStorageSync("appCache", state.appCache);
		},
		setProductSearchHot(state, params) {
			state.appCache.productSearchHot = state.productSearchHot = params;
			uni.setStorageSync("appCache", state.appCache);
		},
		setNetworkState(state, params) {
			state.networkState = params;
		},
		setServerConf(state, params){
			state.serverConf = params;
			state.isAudit = params.isAudit;
			uni.setStorageSync("serverConf", state.serverConf)
		},
		setLastCaptchaTimeStamp(state, params) {
			state.appCache.lastCaptchaTimeStamp = state.lastCaptchaTimeStamp = params;
			uni.setStorageSync("appCache", state.appCache);
		},
		setLastInputMobile(state, params){
			state.appCache.lastInputMobile = state.lastInputMobile = params;
			uni.setStorageSync("appCache", state.appCache);
		},
		setLastSelectMobileArea(state, params){
			state.appCache.lastSelectMobileArea = state.lastSelectMobileArea = params;
			uni.setStorageSync("appCache", state.appCache);
		},
		setOffsetTime(state,params){
			state.offsettime = params;
		},
		setLastEnterMachine(state,params){
			state.lastEnterMachine = params;
		},
		setLastLookDoll(state,params){
			state.lastLookDoll = params;
		},
		setGameSet(state,params){
			state.gameSet = params;
			uni.setStorageSync("gameSet", state.gameSet);
		}
	},
	actions:{
		networkStateChange({
			commit
		}, info) {
			commit("setNetworkState", info);
		},
		login({
			commit,dispatch
		}, info) {
			commit("login", info);
			dispatch("socketLogin");
		},
		reLogin({
			commit
		}, info) {
			commit("logout", "");
			$mRouter.push({
				route: $mPagesConfig.login
			});
		},
		logout({
			commit
		}, info) {
			commit("logout");
		},
		socketLogin({state,dispatch}){
			//socket登陆
			uni.$api.socket.send(uni.$api.socketioConfig.playerLogin,{token:state.accessToken},(res)=>{
				if(res.rtnCode == 0){
					state.socketHadLogin = true;
					uni.$emit('socketSloginsuccess');
				}else{
					uni.showModal({
						title:"提示",
						content:res.msg,
						showCancel:false,
						success: (res) => {
							dispatch("logout");
						}
					})
				}
			});
		},
		getUserInfo({commit}){
			uni.$api.http.get(uni.$api.apiConfig.getUserInfoUrl).then(res=>{
				commit('setUserInfo', res.data);
			}).catch(err=>{
				console.error(err);
			});
		}
	}
})

export default store