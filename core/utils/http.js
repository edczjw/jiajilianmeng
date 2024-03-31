import $mRequest from './luch-request/index';
import $mHelper from './helper';
import $mAppConfig from '../config/appConfig';
import $mResponseCode from '../config/responseCode';
import $mStore from '@/store';
import $ali from './ali';
const $mHttp = new $mRequest();
const info = uni.getSystemInfoSync();

$mHttp.setConfig((config) => {
	config.baseURL = $mAppConfig.apiDomain
	config.header['Content-Type'] = 'application/json';
	config.header['brand'] = info.brand; // 设备品牌
	config.header['model'] = info.model; // 设备型号
	config.header['screenWidth'] = info.screenWidth; // 屏幕宽度
	config.header['screenHeight'] = info.screenHeight; // 屏幕高度
	//#ifdef APP-PLUS
	config.header['platform'] = info.platform; // 客户端平台
	// #endif
	// #ifdef H5
	config.header['platform'] = "h5";
	// #endif
	config.header['system'] = info.system; // 操作系统名称及版本
	config.header['version'] = info.version; // 引擎版本号
	
	
	// config.header['sub2'] = "dafooqwuu.fdfqwqwooppo**sdsffwwert1292KKlll"
	// config.header['authori'] = "D20EE65008F70FDE96C1FABBE7F4BDBE"
	
	
	
	config.dataType = 'json'
	config.responseType = 'text'
	return config
})

$mHttp.validateStatus = (statusCode) => {
	return statusCode === 200
}

$mHttp.interceptors.request.use((config) => {
	config.data = config.data ? config.data : {};
	if(config.method == 'POST'){
		config.params = config.data;
	}
	
	config.header['clientVersion'] = $mStore.state.clientVersion;
	let token = $mStore.state.accessToken || '';
	config.header['token'] = token
	let timestamp = new Date().getTime();
	config.header['timestamp'] = timestamp;
	
	let signParams =$mHelper.isEmpty(config.data)?config.params:config.data;
	if($mHelper.isEmpty(signParams)){
		signParams = $ali.parseQueryString(config.url);
	}
	// console.log(signParams);
	let signstr = $ali.sign(token,timestamp,signParams);
	config.header['sign'] = signstr;
	// console.log(JSON.stringify(config));
	// $mHelper.log(config);
	
	// config.header['app'] = "hzwwc";
	config.header['app'] = "jjlm";
	
	
	// config.data.pwdsign = "202205";
	// config.data.auth2 = "e4b99032416e25acc572b3e9529b879e";
	// config.data.userperm = "416e25acc572b3e9";
	// config.data.userType2 = 1;
	// config.data.pip = "1,10,40";
	// config.data.nickname = "wwc";
	
	return config;
}, config => {
	return Promise.reject(config)
})

//响应拦截器 对响应的公共返回码进行处理，比如版本有更新，登陆失效等。。
$mHttp.interceptors.response.use(async (response) =>{
		// $mHelper.log(response);
		if(response.data.code == $mResponseCode.successCode){
			
			//H5版本更新
			// #ifdef H5
			if(response.data.ver && $mHelper.compareVersion(response.data.ver,$mAppConfig.version)){
				alert('系统检测到升级版本，点击确认进行更新');
				location.href = $mAppConfig.h5Domain;
				return;
			}
			// #endif
			return response.data;
		}else{
			switch(response.data.code){
				case $mResponseCode.accountValidationFailedCode:
					$mHelper.toast('您的登录令牌已过期,请重新登录~');
					$mStore.dispatch('reLogin');
					break;
				case $mResponseCode.dataValidationFailedCode:
					$mHelper.toast(response.data.msg);
					break;
				case $mResponseCode.requestsTooMany:
					$mHelper.toast('您操作的太快啦，休息一下吧~');
					break;
				case $mResponseCode.requestErrorCode:
					$mHelper.toast('错误的请求');
					break;
				case $mResponseCode.methodRefusedCode:
					$mHelper.toast('您的请求被拒绝了');
					break;
				case $mResponseCode.resourceNotExistCode:
					if(response.data.msg){
						$mHelper.toast(response.data.msg);
					}else{
						$mHelper.toast('资源错误');
					}
					break;
				case $mResponseCode.methodNotAllowdCode:
					$mHelper.toast('当前操作不被允许');
					break;
				case $mResponseCode.maintainCode:
					if(response.data.data){
						$mHelper.toast(response.data.data);
					}else{
						$mHelper.toast('维护中...');
					}
					break;
				case $mResponseCode.errorCode:
					$mHelper.toast(response.data.msg || '服务器打瞌睡了~');
					break;
				default:
					$mHelper.toast(response.data.msg);
					break;
			}
			return Promise.reject(response.data.msg);
		}
	}, (error) => {
	// $mHelper.log(error);
	return Promise.reject(error);
})

const http = {
	get(url, data){
		return $mHttp.get(url,{params:data})
	},
	post(utl,data){
		return $mHttp.post(utl,data)
	}
}

export default http
