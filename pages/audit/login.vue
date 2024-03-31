<template>
	<view>
		<!-- #ifndef MP-TOUTIAO -->
		<dz-navbar title="" :is-back="false" :isFixed="false" :background="{background:''}" :border-bottom="false"></dz-navbar>
		<!-- #endif -->
		<view class="wrap">
			<!-- #ifndef MP-TOUTIAO -->
			<view v-if="showVisitor" class="position-absolute text-dark" style="right: 50rpx; top:100rpx;z-index: 999;" @click="showModal">游客模式</view>
			<!-- #endif -->
			<view class="content">
				<view class="logo"><image :src="logo" mode="widthFix"></image></view>
				<view class="dz-flex">
					<view class="dz-flex-1 dz-text-center areacode"><dz-input :disabled="true" v-model="areaCodeLabel"/></view>
					<view class="dz-flex-9"><dz-input type="text" v-model="mobile" :disabled="isLogining" :placeholder="language.login.mobileHolder" /></view>
				</view>
				<dz-line></dz-line>
				<view class="tips">{{ language.login.mobileLoginTips }}</view>
				<block>
					<dz-button
						:loading="isLogining"
						@click="getCaptcha"
						:custom-style="{ background: submitChecked || waitingCaptcha || isLogining ? theme.dzBaseDisabled : theme.dzBaseColor, color: theme.dzBaseFontColor }"
						hover-class="none"
						:border="false"
						:disabled="submitChecked || waitingCaptcha"
						class="getCaptcha"
					>
						{{ waitingCaptcha ? $api.helper.formatString(language.login.getCaptchaLater, waitingSecond) : language.login.getCaptcha }}
					</dz-button>
				</block>
				
				<!-- #ifndef MP-TOUTIAO -->
				<dz-divider margin-top="250" margin-bottom="30" bg-color="#f3f3f3">其他登录方式</dz-divider>
				<view>
					<view v-if="showApple" class="flex j-center a-center bg-black text-center p-2 rounded-15" @click="appleLogin">
						<u-icon name="apple-fill" size="46" color="white"></u-icon>
						<text class="ml-1" style="font-size: 32rpx;color: white;">通过Apple登录</text>
					</view>
					<view v-if="showWechat" class="flex j-center a-center bg-blue text-center p-2 rounded-15 mt-5" @click="wechatLogin">
						<u-icon name="weixin-fill" size="46" color="white"></u-icon>
						<text class="ml-1" style="font-size: 32rpx;color: white;">微信登录</text>
					</view>
				</view>
				<!-- #endif -->
			</view>
			<!-- <view class="buttom">
				<view class="hint">
					<block>
						<view class="dz-text-center">
							<dz-checkbox v-model="agreeCheck" shape="circle" label-size="22" :active-color="theme.dzBaseColor">
								我已仔细阅读并同意
								<text class="link" @tap="protocal('article', 102)">《用户使用协议》</text>
								和
								<text class="link" @tap="protocal('article', 1)">《隐私保护政策》</text>
							</dz-checkbox>
						</view>
					</block>
				</view>
			</view> -->
		</view>
		<!-- 游客登录提醒 -->
		<dz-modal
			v-model="modalShow"
			:mask-close-able="false"
			content="游客账号仅限当前设备使用,更换设备将无法登录该账号。建议使用其他登陆方式或登录后立即进行手机绑定。"
			:show-cancel-button="!modalLoading"
			:confirm-color="theme.dzBaseColor"
			:async-close="true"
			@cancel="modalCancel"
			@confirm="modalConfirm"
		></dz-modal>
		<dz-toast ref="dzToast"></dz-toast>
	</view>
</template>

<script>
import {mapState} from 'vuex';
import crypto from '@/core/utils/crypto-js.js';
export default{
	data(){
		return {
			language:this.$api.language,
			theme:this.$api.theme,
			appName:this.$api.language.application.appName,
			logo:this.$api.assetsConfig.wwjDollLogo,
			areaCodeLabel:"+86",
			mobile:'',
			isLogining:false,
			waitingCaptcha:false,
			waitingSecond:this.$api.appConfig.loginCodeSecond,
			agreeCheck:true,
			timeInterval:null,
			modalShow: false,
			modalLoading: false,
			platform: this.$api.systemInfo.platform,
			showWechat: false,
			showVisitor: true,
			showApple: false,
		}
	},
	computed:{
		submitChecked() {
			if (this.$api.helper.isMobile(this.mobile)) {
				return false;
			}
			return true;
		}
	},
	onShow() {
		this.computeCaptchaLastTime();
	},
	onLoad() {
		// #ifdef APP-PLUS
		if(plus.runtime.isApplicationExist({pname:'com.tencent.mm', action:'weixin://'})){
			//安装了微信
			console.log('===============安装了微信');
		}else{
		   //未安装微信
		   console.log('================未安装微信');
		   if(this.platform === 'ios'){
			   this.showWechat = false;
		   }
		}
		
		if(this.platform === 'ios'){
			let system = plus.os.version.split("\.")[0];
			if(system >= 13){
				this.showApple = true
			}
		}
		// #endif
	},
	methods:{
		getCaptcha(){
			if (!this.agreeCheck) {
				this.$refs.dzToast.show({
					title: '请仔细阅读并勾选用户协议',
					type: 'warning'
				});
				return;
			}
			//跳转到验证码输入界面
			if(this.isLogining){
				return;
			}
			this.isLogining = true;
			
			if(this.$api.helper.isMobile(this.mobile)){
				this.$api.http.post(this.$api.apiConfig.sendPhoneCode,{
					phone:this.mobile,
					codeType:1
				}).then(res=>{
					console.log(res);
					this.$api.store.commit('setLastCaptchaTimeStamp', parseInt(new Date().getTime())/1000);
					this.$api.store.commit('setLastInputMobile', this.mobile);
					this.computeCaptchaLastTime();
					this.isLogining = false;
					
					//跳转到验证码输入界面
					this.$api.router.push({
						route:this.$api.pagesConfig.captcha,
						query:{
							mobile:this.$api.helper.strEncode(this.mobile)
						}
					});
				}).catch(err=>{
					this.loading = false;
					console.error(err);
				});
			}else{
				this.loading = false;
				this.$refs.dzToast.show({
					title:this.$api.language.loginCode.mobileError,
					type:'warning'
				});
			}
			
		},
		computeCaptchaLastTime() {
			if (this.timeInterval) {
				return;
			}
			this.lastCaptchaTimeStamp = parseInt(this.$api.store.state.lastCaptchaTimeStamp);
			let timeNow = parseInt(new Date().getTime() / 1000);
			let timeDiff = timeNow - this.lastCaptchaTimeStamp;
			if (timeDiff < this.$api.appConfig.loginCodeSecond && timeDiff >= 0) {
				this.waitingCaptcha = true;
				this.waitingSecond = this.$api.appConfig.loginCodeSecond - timeDiff;
				this.timeInterval = setInterval(() => {
					this.waitingSecond--;
					if (this.waitingSecond <= 0) {
						this.waitingCaptcha = false;
						clearInterval(this.timeInterval);
						this.timeInterval = null;
					}
				}, 1000);
			} else {
				this.waitingCaptcha = false;
			}
		},
		protocal(url, id) {
			this.$api.router.push({
				route: this.$api.pagesConfig[url],
				query: {id: id}
			});
		},
		showModal() {
			if (!this.agreeCheck) {
				this.$refs.dzToast.show({
					title: '请仔细阅读并勾选用户协议',
					type: 'warning'
				});
				return;
			}
			this.modalShow = true;
		},
		visitorLogin(){
			// console.log("===========================visitorLogin");
			let clientid = uni.getStorageSync('clientid');
			if(clientid == ''){
				clientid = this.getClientId();
			}
			let dp = uni.getStorageSync('downloadParams');
			if(!dp){
				dp = "";
			}
			// console.log("========================clientid="+clientid);
			this.$api.http.post(this.$api.apiConfig.visitorLogin, {
				device: crypto.MD5(clientid).toString(),
				dp: dp
			}).then(res=>{
				console.log("res: " + JSON.stringify(res));
				if (res.code == 200) {
					this.$refs.dzToast.show({
						title: '登录成功',
						type: 'success'
					});
					this.$api.store.dispatch('login', res);
					uni.$emit('sgninChange');
					
					setTimeout(() => {
						this.modalShow = false;
						uni.switchTab({
							url : "/pages/main/profile/profile"
						})
					}, 500);
				} else {
					this.$refs.dzToast.show({
						title: res.msg,
						type: 'error'
					});
					this.modalShow = false;
				}
			}).catch(error=>{
				console.error(error);
				this.modalShow = false;
			})
		},
		
		wechatLogin(){
			if (!this.agreeCheck) {
				this.$refs.dzToast.show({
					title: '请仔细阅读并勾选用户协议',
					type: 'warning'
				});
				return;
			}
			
			let self = this;
			uni.login({
				provider: 'weixin',
				onlyAuthorize: true,
				success: loginRes => {
					let dp = uni.getStorageSync('downloadParams');
					if(!dp){
						dp = "";
					}
					
					this.$api.http.post(this.$api.apiConfig.wxLogin, {
						code: loginRes.code,
						dp: dp,
					}).then(res=>{
						if(res.code==200){
							self.$refs.dzToast.show({
								title: '登录成功',
								type: 'success'
							});
							self.$api.store.dispatch('login', res);
							uni.$emit('sgninChange');
							
							setTimeout(() => {
								uni.switchTab({
									url : "/pages/main/profile/profile"
								})
							}, 500);
						}else{
							self.$refs.dzToast.show({
								title: res.msg,
								type: 'error'
							});
						}
					}).catch(err=>{
						console.error(err);
					});
				},
				fail: err => {
					console.log('微信登录失败' + JSON.stringify(err))
					self.$refs.dzToast.show({
						title: '登录失败',
						type: 'error'
					});
				}
			})
		},
		appleLogin(){
			if (!this.agreeCheck) {
				this.$refs.dzToast.show({
					title: '请仔细阅读并勾选用户协议',
					type: 'warning'
				});
				return;
			}
			let self = this 
			uni.login({
				provider: 'apple',
				success: loginRes => {
					uni.getUserInfo({
						provider: 'apple',
						success: userInfoRes => {
							console.log(userInfoRes);
							let dp = uni.getStorageSync('downloadParams');
							if(!dp){
								dp = "";
							}
							
							let user = userInfoRes.userInfo
							this.$api.http.post(this.$api.apiConfig.appleLogin, {
								identityToken: user.identityToken,
								dp: dp
							}).then(res=>{
								if(res.code==200){
									self.$refs.dzToast.show({
										title: '登录成功',
										type: 'success'
									});
									self.$api.store.dispatch('login', res);
									uni.$emit('sgninChange');
									
									setTimeout(() => {
										uni.switchTab({
											url : "/pages/main/profile/profile"
										})
									}, 500);
								}else{
									self.$refs.dzToast.show({
										title: res.msg,
										type: 'error'
									});
								}
							}).catch(err=>{
								console.error(err);
							});
						}
					})
				},
				fail: err => {
					console.log('apple登录失败' + JSON.stringify(err))
					self.$refs.dzToast.show({
						title: '登录失败',
						type: 'error'
					});
				}
			})
		},
		phoneLogin() {
			if (!this.agreeCheck) {
				this.$refs.dzToast.show({
					title: '请仔细阅读并勾选用户协议',
					type: 'warning'
				});
				return;
			}
			
			this.$api.router.push({
				route: this.$api.pagesConfig.phoneLogin,
				query: {}
			});
		},
		//关闭
		modalCancel() {
			if (!this.modalLoading) {
				this.modalShow = false;
			}
		},
		// 确认
		modalConfirm() {
			this.modalLoading = true;
			this.visitorLogin();
		},
		//获取客户端ID和版本号
		getClientId() {
			let clientid = '';
			// #ifdef APP-PLUS
			if (this.platform == 'ios') {
				plus.device.getInfo({
					success: function(e) {
						clientid = e.uuid;
						uni.setStorageSync('clientid', clientid);
					},
					fail: function(e) {
						console.log(e);
					}
				});
			} else if (this.platform == 'android') {
				plus.device.getAAID({
					success: function(e) {
						clientid = e.aaid;
						console.log(clientid);
						uni.setStorageSync('clientid', clientid);
					},
					fail: function(e) {
						console.log(e);
					}
				});
			}

			if (clientid == '') {
				clientid = plus.device.uuid;
				console.log("=================plus.device.uuid="+clientid);
				uni.setStorageSync('clientid', clientid);
			}
			// #endif
			return clientid;
		},
	}
}
</script>

<style lang="scss" scoped>
page {
	background-color: #fff;
}
.dz-back-wrap {
	align-items: center;
	flex: 1;
	flex-grow: 0;
	padding: 14rpx 14rpx 14rpx 24rpx;
}
.wrap {
	font-size: 28rpx;
	margin-top: 50rpx;
	.content {
		width: 600rpx;
		margin: 150rpx auto 0;
		.login-btn {
			margin-top: 50rpx;
		}
		.title {
			text-align: left;
			font-size: 60rpx;
			font-weight: 500;
			margin-bottom: 100rpx;
		}
		.logo {
			text-align: center;
			margin-bottom: 80rpx;

			image {
				width: 200rpx;
				height: 200rpx;
				border-radius: 45rpx;
			}
		}
		input {
			text-align: left;
			margin-bottom: 10rpx;
			padding-bottom: 6rpx;
		}
		.tips {
			color: $dz-type-info;
			margin-bottom: 60rpx;
			margin-top: 20rpx;
		}
		.getCaptcha {
			font-size: 30rpx;
			padding: 12rpx 0;
		}
	}
	.buttom {
		.loginType {
			display: flex;
			width: 100%;
			padding: 150rpx 50rpx 150rpx 50rpx;
			justify-content: space-between;

			.item {
				display: flex;
				flex-direction: column;
				width: 100%;
				align-items: center;
				justify-content: center;
				color: $dz-content-color;
				font-size: 24rpx;

				.icon {
					margin-bottom: 10rpx;
				}
			}
		}
	}
}
.alternative {
	color: $dz-tips-color;
	display: flex;
	justify-content: space-between;
	margin-top: 60rpx;
}
.hint {
	position: absolute;
	width: 100%;
	padding: 30rpx 40rpx 0rpx;
	padding-bottom: env(safe-area-inset-bottom);
	font-size: 20rpx;
	color: $dz-tips-color;
	bottom: 50rpx;

	.link {
		color: $dz-type-warning;
	}
}
.dz-transparent-btn {
	display: block;
	background: transparent;
	margin: 0;
	padding: 0;
	border-radius: 0;
	border: 0;
	width: 100%;
	line-height: 1;

	.item {
		display: flex;
		flex-direction: column;
		width: 100%;
		align-items: center;
		justify-content: center;
		color: $dz-content-color;
		font-size: 24rpx;

		.icon {
			margin-bottom: 10rpx;
		}
	}
	.hint {
		position: absolute;
		width: 100%;
		padding: 0 40rpx;
		padding-bottom: env(safe-area-inset-bottom);
		font-size: 20rpx;
		color: $dz-tips-color;
		bottom: 60rpx;
		left: 0;
		z-index: 10;
		.link {
			color: $dz-type-warning;
		}
	}
}

.dz-transparent-btn::after {
	border: 0;
}
</style>
