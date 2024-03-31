<template>
	<view>
		<dz-navbar :title="language.profile.userInfo"></dz-navbar>
		<view>
			<dz-cell-group :border="false">
				<dz-cell-item  :borderBottom="true" :arrow="false">
					<view class="head-portrait" solt="icon">
						<image :src="utils.formatImg(userInfo.icon) || missingFace" mode=""></image>
						<view class="user-name">{{ userInfo.nick || userInfo.phone }}</view>
					</view>
				</dz-cell-item>
				<dz-cell-item
					:borderBottom="true"
					center
					:title="language.user.address"
					icon="dizhi"
					iconSize="45"
					:icon-style="{ color: '#2EAFFF', 'margin-right': '30rpx' }"
					@tap="cellTap('address')"
				></dz-cell-item>
				<dz-cell-item
					:borderBottom="false"
					center
					:title="language.user.bindMobile"
					icon="mobilefill"
					iconSize="45"
					:icon-style="{ color: '#fd1c9c', 'margin-right': '30rpx' }"
					:value="userInfo.phone? userInfo.phone : language.user.unbound"
					@tap="cellTap('bindMobile')"
				></dz-cell-item>
			</dz-cell-group>
			<dz-cell-group class="dz-m-t-20" :border="false">
				<dz-cell-item
					:borderBottom="false"
					center
					:title="language.user.accountCancellation"
					icon="people_list_light"
					iconSize="45"
					:icon-style="{ color: '#FF6F8E', 'margin-right': '30rpx' }"
					:value="language.user.cancellationTips"
					@tap="cancellation"
				></dz-cell-item>
			</dz-cell-group>
		</view>
		<!-- 注销账号提醒 -->
		<dz-modal
			v-model="modalShow"
			:mask-close-able="false"
			content="提交注销申请后账号有45天冷静期。在冷静期满后将完成注销。注销完成后将删除该账号的所有数据且无法恢复,请谨慎操作!(冷静期内请勿登录和使用该账号,否则视为视为您撤销注销申请!)"
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
			// modalContent: this.$api.language.user.confirmLogOut,
			modalLoading: false,
			version: '',
		};
	},
	async onLoad() {
		uni.setNavigationBarTitle({
			title: this.$api.language.profile.userInfo
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
		cellTap(url) {
			if (url === "bindMobile") {
				if (this.userInfo.phone) {
					return;
				}
			}
			this.$api.router.push({
				route: this.$api.pagesConfig[url],
				query: {}
			});
		},
		// 注销
		cancellation() {
			this.modalShow = true;
		},
		// 退出
		logoutTap() {
			this.logout();
			setTimeout(() => {
				this.modalShow = false;
				this.$api.router.back();
			}, 500);
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
			this.$api.http.get(this.$api.apiConfig.logOff).then(res=>{
				// console.log(res);
				if(res.code == 200){
					this.$refs.dzToast.show({
						title: '注销申请已提交',
						type: 'success'
					});
					this.logoutTap();
				}else{
					this.$refs.dzToast.show({
						title: res.msg,
						type: 'error'
					});
				}
			}).catch(error=>{
				console.error(error);
				this.$refs.dzToast.show({
					title: '申请失败,请稍后重试',
					type: 'error'
				});
			});
		},
		//检查更新
		async tapUpdate() {
			let _this = this;
			// #ifdef APP-PLUS
			if (!this.$api.appConfig.checkUpdate) {
				return;
			}
			let type = plus.os.name == 'iOS' ? 2 : 1;
			try {
				const wgtInfo = await _this.$api.helper.getWgtInfoAsync();
				const res = await _this.$api.http.get(this.$api.apiVersions.appVersion, {
					params: {
						type: type,
						version: wgtInfo.version
					}
				});
				if (res.data) {
					//验证跳过版本
					let jumpVersion = uni.getStorageSync('jumpUpdateVersion');
					let isUpdate = _this.$api.helper.compareVersion(res.data.version, jumpVersion);
					if (isUpdate) {
						let updateData = {
							content: res.data.content,
							version: res.data.version,
							is_enforce: parseInt(res.data.is_enforce),
							download_url: res.data.download_url,
							progress: true,
							mask_click: false,
							buttonNum: 0
						};
						this.$api.appUpdate(updateData);
					}
				} else {
					_this.$refs.dzToast.show({
						title: '当前已是最新版本',
						type: 'warning'
					});
				}
			} catch (e) {
				console.log(e);
			}
			// #endif
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
	justify-content: center;
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
