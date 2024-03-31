<template>
	<view>
		<dz-navbar :is-fixed="true" :title="language.loginCode.titleCode"></dz-navbar>
		<view class="key-input">
			<view class="title">{{ language.loginCode.inputCode }}</view>
			<view class="tips">{{ $api.helper.formatString(language.loginCode.codeSendTo, maskMobile) }}</view>
		</view>
		<view id="menu-id" @longtap="longTap">
			<dz-message-input
				:disabled-keyboard="true"
				:value="codeValue"
				:active-color="theme.dzBaseColor"
				@finish="codeFinish"
				mode="bottomLine"
				:maxlength="maxlength"
			></dz-message-input>
		</view>
		<dz-keyboard
			v-model="keyboardShow"
			mode="number"
			:z-index="keyboardZindex"
			:dot-enabled="false"
			:tips="waitingCaptcha ? $api.helper.formatString(language.loginCode.getCaptchaLater, waitingSecond) : language.loginCode.noCaptcha"
			:tips-color="waitingCaptcha ? theme.dzMainColor : $api.theme.dzBaseColor"
			:show-tips="true"
			:cancel-btn="false"
			:confirm-btn="false"
			:mask="false"
			:safe-area-inset-bottom="true"
			:mask-close-able="false"
			@change="keyboardChange"
			@backspace="keyboardBackspace"
			@tipsClick="keyboardTipsClick"
		></dz-keyboard>
		<dz-toast ref="dzToast"></dz-toast>
		<wwj-menu-popup v-model="menu.value" :pop-data="menu.menu" dynamic :x="menu.x" :y="menu.y" direction="row" theme="dark" :placement="menu.place" @tapPopup="tapPopup" />
	</view>
</template>

<script>
export default {
	data() {
		return {
			theme: this.$api.theme,
			language: this.$api.language,
			loading: false,
			keyboardShow: true,
			mobile: '',
			mobile_area: '86',
			maskMobile: '',
			maxlength: 6,
			codeValue: '',
			waitingSecond: this.$api.appConfig.loginCodeSecond,
			lastCaptchaTimeStamp: 0,
			waitingCaptcha: true,
			timeInterval: null,
			keyboardZindex: 979, //H5会覆盖到navbar返回按钮，这里需要自定义navbar，并且设置keyboard的zindex
			menu: {
				x: 0,
				y: 0,
				menu: [
					{
						title: '粘贴'
					}
				],
				value: false,
				place: 'bottom-end'
			},
			clipboardData: ''
		};
	},
	async onLoad(e) {
		
		uni.setNavigationBarTitle({
			title: this.$api.language.loginCode.titleCode
		});
		await this.$onLaunched;
		this.maxlength = parseInt(this.$api.appConfig.loginCodeLength);
		this.mobile = this.$api.helper.strDecode(e.mobile);
		this.maskMobile = '+' + this.mobile_area + ' ' + this.$api.helper.maskCode(this.mobile, 3, 4);
		this.computeCaptchaLastTime();
	},
	methods: {
		computeCaptchaLastTime() {
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
		async longTap() {
			let isCode = true;
			await this.$api.helper.getClipboardData().then(res => {
				const num = /^[0-9]*$/;
				let code = res.replace(/\s/g, '');
				if (num.test(code) && code.length == this.maxlength) {
					this.clipboardData = code;
				} else {
					this.menu.value = false;
					isCode = false;
					return;
				}
			});
			if (!isCode) return;
			let dom = uni.createSelectorQuery().in(this);
			dom.select('#menu-id').boundingClientRect();
			dom.exec(data => {
				let isTop = data[0].top >= 60,
					place = isTop ? 'bottom' : 'top';
				this.menu.place = place + '-center';
				this.menu.value = !this.menu.value;
				this.menu.x = data[0]['width'] / 2;
				this.menu.y = data[0][isTop ? 'top' : 'bottom'];
			});
		},
		tapPopup(e) {
			if (!this.clipboardData) return;
			this.codeValue = this.clipboardData;
			this.codeFinish(this.codeValue);
		},
		keyboardChange(e) {
			if (this.codeValue.length >= this.maxlength) {
				return;
			}
			this.codeValue += e;
		},
		keyboardBackspace() {
			if (this.codeValue.length) {
				this.codeValue = this.codeValue.substr(0, this.codeValue.length - 1);
			}
		},
		keyboardTipsClick() {
			if (this.waitingCaptcha) {
				return;
			}
			if (this.loading) {
				return;
			}
			this.loading = true;
			
			if (this.$api.helper.isMobile(this.mobile)) {
				this.$api.http.post(this.$api.apiConfig.sendPhoneCode,{
					phone:this.mobile,
					codeType:1
				}).then(res=>{
					console.log(res);
					this.$api.store.commit('setLastCaptchaTimeStamp', parseInt(new Date().getTime())/1000);
					this.computeCaptchaLastTime();
					this.isLogining = false;
					this.$refs.dzToast.show({
						title: this.$api.language.loginCode.codeSend,
						type: 'success'
					});
				}).catch(err=>{
					console.error(err);
				});
			} else {
				this.loading = false;
				this.$refs.dzToast.show({
					title: this.$api.language.loginCode.mobileError,
					type: 'warning'
				});
			}
		},
		// 输入完验证码最后一位执行
		codeFinish(value) {
			if (this.loading) {
				return;
			}
			this.loading = true;
			uni.showLoading({
				mask: true
			});
			let formData = {
				phone: this.mobile,
				code: this.codeValue,
			};
			let dp = uni.getStorageSync('downloadParams');
			if(!dp){
				dp = "";
			}
			formData.dp = dp;
			
			this.$api.http
				.post(this.$api.apiConfig.phoneLoginUrl, {
					...formData
				})
				.then(res => {
					this.$api.store.dispatch('login', res);
					uni.$emit('sgninChange');
					this.loading = false;
					uni.hideLoading();
					
					uni.switchTab({
						url : "/pages/main/profile/profile"
					})
					
					// 获取当前页面栈，如果页面栈小于3，则直接跳转到首页
					/* let pages = getCurrentPages();
					if (pages.length <= 2 || pages.length > 3) {
						uni.reLaunch({
							url: this.$api.pagesConfig.index
						});
					} else {
						this.$api.router.back(2);
					} */
				})
				.catch(err => {
					this.loading = false;
					uni.hideLoading();
				});
		}
	}
};
</script>

<style lang="scss">
page {
	background-color: #fff;
}

.box {
	margin: 30rpx 0;
	font-size: 30rpx;
	color: $dz-light-color;
}

.key-input {
	padding: 110rpx 80rpx 0 80rpx;
	z-index: 1000;
}

.title {
	font-size: 50rpx;
	color: $dz-main-color;
}

.key-input .tips {
	font-size: 30rpx;
	color: $dz-main-color;
	margin-top: 20rpx;
	margin-bottom: 60rpx;
}
#menu-id {
	width: 100%;
	position: relative;
	z-index: 999;
}
.captcha {
	color: $dz-type-warning;
	font-size: 30rpx;
	margin-top: 40rpx;
}
</style>
