<template>
	<view>
		<dz-navbar :title="language.profile.setting"></dz-navbar>
		<view>
			<dz-cell-group :border="false">
				<!-- <dz-cell-item
					center
					title="背景音乐"
					:border-bottom="true"
					:arrow="false"
				>
					<dz-switch slot="right-icon" v-model="bgMusic" @change="bgMusicChange(bgMusic)" :active-color="theme.dzBaseColor"></dz-switch>
				</dz-cell-item>
				<dz-cell-item
					center
					title="操作音效"
					:border-bottom="true"
					:arrow="false"
				>
					<dz-switch slot="right-icon" v-model="operationSound" @change="soundChange(operationSound)" :active-color="theme.dzBaseColor"></dz-switch>
				</dz-cell-item> -->
				<!-- <dz-cell-item
					:borderBottom="false"
					center
					title="青少年模式"
					:value="youthMode"
					@tap="cellTap('youthMode')"
				></dz-cell-item> -->
			</dz-cell-group>
			<dz-cell-group class="dz-m-t-20" :border="false">
				<dz-cell-item
					:borderBottom="true"
					center
					title="用户协议"
					@tap="cellTap('article', 1)"
				></dz-cell-item>
				<dz-cell-item
					:borderBottom="true"
					center
					title="隐私政策"
					@tap="cellTap('article', 1)"
				></dz-cell-item>
				<!-- <dz-cell-item
					:borderBottom="false"
					center
					title="关于我们"
					@tap="cellTap('article', 2)"
				></dz-cell-item> -->
			</dz-cell-group>
			<dz-cell-group class="dz-m-t-20" :border="false">
				<dz-cell-item
					:borderBottom="false"
					center
					title="当前版本"
					:value="version"
					@tap="tapUpdate"
				></dz-cell-item>
				<!-- <dz-cell-item
					:borderBottom="false"
					center
					title="意见反馈"
					icon="writefill"
					iconSize="45"
					:icon-style="{ color: '#807DFC', 'margin-right': '30rpx' }"
					@tap="cellTap('feedback')"
				></dz-cell-item> -->
			</dz-cell-group>
			<view class="dz-m-t-80 dz-p-b-50 dz-flex dz-row-center">
				<view class="btn" style="width: 90%;">
					<dz-button :border="false" :custom-style="{ background: theme.dzBaseColor, color: theme.dzBaseFontColor }" hover-class="none" shape="circle" @click="logoutTap">
						{{ language.user.logOut }}
					</dz-button>
				</view>
			</view>
		</view>
		<!-- 退出提醒 -->
		<dz-modal
			v-model="modalShow"
			:mask-close-able="false"
			:content="modalContent"
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
import { mapState, mapMutations } from 'vuex';
export default {
	data() {
		return {
			utils:uni.$api.helper,
			missingFace: this.$api.assetsConfig.missingFace,
			theme: this.$api.theme,
			language: this.$api.language,
			modalShow: false,
			modalContent: this.$api.language.user.confirmLogOut,
			modalLoading: false,
			version: '',
			bgMusic: true,
			operationSound: true,
			youthMode: '未开启'
		};
	},
	async onLoad() {
		uni.setNavigationBarTitle({
			title: this.$api.language.profile.setting
		});
		await this.$onLaunched;
		// #ifdef APP-PLUS
		let wgtInfo = await this.$api.helper.getWgtInfoAsync();
		this.version = wgtInfo.version;
		// #endif
		// #ifndef APP-PLUS
		this.version = this.$api.appConfig.version;
		// #endif
	},
	computed: {
		...mapState(['userInfo'])
	},
	created() {
		
	},
	methods: {
		...mapMutations(['logout', 'setUserHeadPortrait']),
		async updateUserInfo(data) {
			
		},
		cellTap(url, id) {
			this.$api.router.push({
				route: this.$api.pagesConfig[url],
				query: {id: id}
			});
		},
		bgMusicChange(e) {
			// console.log("========================bgMusicChange");
			// console.log(e);
			// let aa = "好好风景"
			// let bb = "华府丹郡黄焖鸡"
			// let ss = `nvjbhf${aa}jkljklhuughbnvfvt${bb}ghujhbf`
			// console.log(ss);
		},
		soundChange(e) {
			
		},
		// 退出
		logoutTap() {
			this.modalShow = true;
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
			this.logout();
			setTimeout(() => {
				this.modalShow = false;
				this.$api.router.back();
			}, 500);
		},
		//检查更新
		async tapUpdate() {
			let _this = this;
			//#ifdef APP-PLUS
			plus.runtime.getProperty(plus.runtime.appid, (widgetInfo)=> {
				let param = {
					version: widgetInfo.version,
					appid: widgetInfo.appid
				}
				this.$api.http.post(this.$api.apiConfig.appVersionUpdate, param).then(res => {
					console.log(res);
					if(res.code ==200){
						if (!res.data){
							this.$refs.dzToast.show({
								title: '当前已是最新版本',
								type: 'warning'
							});
							return;
						}
						let updateData = {};
						let updateCmd =  res.data.updateCmd || 0;
						if(updateCmd == 0){
							this.$refs.dzToast.show({
								title: '当前已是最新版本',
								type: 'warning'
							});
							return;
						}
						updateData.is_enforce = updateCmd==2||updateCmd==4?1:0;
						updateData.version = res.data.version;
						updateData.content = res.data.note || "版本优化升级";
						updateData.progress = true;
						if(updateCmd==1 || updateCmd==2){
							updateData.download_url = res.data.wgtUrl;
						}
						if(updateCmd==3 || updateCmd==4){
							let sysInfo = uni.getSystemInfoSync();
							updateData.download_url = sysInfo.platform=='ios'?res.data.pkgiOSUrl:res.data.pkgAndUrl;
						}
						// console.log(updateData);
						this.$api.appUpdate(updateData);
					}
				}).catch(err=>{
					console.log(err);
				})
			});
			//#endif
			
			
			// #ifdef MP-WEIXIN
			if (uni.canIUse('getUpdateManager')) {
				const updateManager = uni.getUpdateManager();
				updateManager.onCheckForUpdate(function(res) {
					if (res.hasUpdate) {
						updateManager.onUpdateReady(function(res) {
							uni.showModal({
								title: '更新提示',
								content: '新版本已经准备好，是否重启应用？',
								success(res) {
									if (res.confirm) {
										updateManager.applyUpdate();
									}
								}
							});
						});
						updateManager.onUpdateFailed(function(res) {
							wx.showModal({
								title: '发现新版本',
								content: '新版本已经上线啦，请您删除当前小程序，重新搜索打开'
							});
						});
					} else {
						_this.$refs.dzToast.show({
							title: '当前已是最新版本',
							type: 'warning'
						});
					}
				});
			} else {
				uni.showModal({
					title: '提示',
					content: '当前微信版本过低，无法更好体验程序，请升级到最新微信版本后重试。',
					showCancel: false
				});
			}
			// #endif
			
			// #ifndef APP-PLUS || MP-WEIXIN
			this.$refs.dzToast.show({
				title: '当前已是最新版本',
				type: 'warning'
			});
			// #endif
		},
	}
};
</script>

<style lang="scss">
.head-portrait {
	display: flex;
	align-items: center;
	image {
		width: 120rpx;
		height: 120rpx;
		border-radius: 50%;
	}
	.upload {
		width: 120rpx;
		height: 120rpx;
		border-radius: 50%;
		overflow: hidden;
		background-color: $dz-content-color;
	}
	.user-name {
		margin-left: 20rpx;
		font-size: 32rpx;
		color: $dz-main-color;
	}
}
.btn {
	margin-bottom: env(safe-area-inset-bottom);
}
.layout {
	padding: 6rpx 6rpx;
	border: 2rpx solid #fff;
	border-radius: 16rpx;
	.layout-item {
		width: 70rpx;
		height: 70rpx;
		border-radius: 16rpx;
	}
}
</style>
