<template>
	<view>
		<!-- <dz-navbar-immersive splitLine scrollRatio="0.3" :isCustom="true" @change="opacityChange" :scrollTop="scrollTop" backgroundColor="#fff" :style="[navbarStyle]">
			<dz-navbar title="推广中心"></dz-navbar>
		</dz-navbar-immersive> -->
		<dz-navbar
			title="推广中心"
			:title-color="theme.dzBaseFontColor"
			:back-icon-color="theme.dzBaseFontColor"
			:border-bottom="false"
			:background="{ background: 'linear-gradient(90deg, ' + theme.dzBaseDark + ', ' + theme.dzBaseColor + ')' }"
		></dz-navbar>
		<wwj-scroll-body class="goodlist" @init="mescrollInit" @down="downCallback" @up="upCallback">
			<view class="pure_top" :style="{ background: 'linear-gradient(90deg, ' + theme.dzBaseDark + ', ' + theme.dzBaseColor + ')' }"></view>
			<view class="content">
				<view class="user-info" :style="{ background: theme.dzPromotColor }">
					<view class="user">
						<view class="img">
							<dz-avatar :src="helper.formatImg(userInfo.icon) || missingFace" size="large" :isBorder="true" :borderColor="'rgba(255,255,255,0.6)'"></dz-avatar>
						</view>
						<view class="dz-flex-8">
							<view class="name dz-line-1" style="max-width: 500rpx;">{{ userInfo.nick }}</view>
							<view class="dz-font-24 dz-m-l-30 dz-flex dz-flex-ac dz-m-t-20">
								<text class="dz-m-r-20">用户ID: {{ userInfo.id }}</text>
								<view>
									<dz-button
										size="mini"
										type="info"
										shape="circle"
										throttleTime="200"
										hoverClass="none"
										:border="false"
										:customStyle="{ height: '40rpx', background: '#FFF', lineHeight: '40rpx' }"
										@click="copy(userInfo.id)"
									>
										复制
									</dz-button>
								</view>
							</view>
						</view>
					</view>
					<view class="card">
						<view class="card-item">
							<view>{{ countExtend }}人</view>
							<!-- 推广人数 -->
							<view class="dz-m-t-10">推广人数</view>
						</view>
						<view class="card-item">
							<!-- 未提现佣金 -->
							<view>¥{{ sumUnWithdraw }}</view>
							<view class="dz-m-t-10">未提现佣金</view>
						</view>
						<view class="card-item">
							<view>¥{{ sumCommission }}</view>
							<!-- 累计佣金 -->
							<view class="dz-m-t-10">累计佣金</view>
						</view>
					</view>
				</view>
				<view class="order">
					<dz-cell-item
						title="推广"
						:arrow="false"
						:border-bottom="false"
						:title-style="{ 'font-size': '32rpx', color: theme.dzMainColor, 'font-weight': '700' }"
						hover-class="none"
					></dz-cell-item>
					<dz-grid col="2" :border="false" style="margin-top: -30rpx; ">
						<!-- 我的推广 -->
						<dz-grid-item @tap="toPage('myDistribution')">
							<view class="icon-bg" :style="{ background: helper.colorToRgba(theme.dzBaseDisabled) }">
								<view><dz-icon name="friend" size="55" :color="theme.dzBaseColor"></dz-icon></view>
							</view>
							<text class="dz-font-sm dz-m-t-10 dz-color-6">我的推广</text>
						</dz-grid-item>
						<!-- 推广海报 -->
						<dz-grid-item @tap="toPage('poster')">
							<view class="icon-bg" :style="{ background: helper.colorToRgba(theme.dzBaseDisabled) }">
								<view><dz-icon name="pic" size="55" :color="theme.dzBaseColor"></dz-icon></view>
							</view>
							<text class="dz-font-sm  dz-m-t-10 dz-color-6">推广海报</text>
						</dz-grid-item>
					</dz-grid>
				</view>

				<view class="order">
					<dz-cell-item
						title='佣金'
						:arrow="false"
						:border-bottom="false"
						:title-style="{ 'font-size': '32rpx', color: theme.dzMainColor, 'font-weight': '700' }"
						hover-class="none"
					></dz-cell-item>
					<dz-grid col="3" :border="false" style="margin-top: -30rpx;">
						<!-- 佣金明细 -->
						<dz-grid-item @tap="toPage('brokerageCapital')">
							<view class="icon-bg">
								<view><dz-icon name="edit" size="55" color="#999"></dz-icon></view>
							</view>
							<text class="dz-font-sm dz-m-t-10 dz-color-6">佣金明细</text>
						</dz-grid-item>
						<!-- 我要提现 -->
						<dz-grid-item @tap="toPage('withdraw')">
							<view class="icon-bg">
								<view><dz-icon name="sponsor" size="55" color="#999"></dz-icon></view>
							</view>
							<text class="dz-font-sm dz-m-t-10 dz-color-6">我要提现</text>
						</dz-grid-item>
						<!-- 提现记录 -->
						<dz-grid-item @tap="toPage('withdrawRecord')">
							<view class="icon-bg">
								<view><dz-icon name="tixianjilu" size="55" color="#999"></dz-icon></view>
							</view>
							<text class="dz-font-sm  dz-m-t-10 dz-color-6">提现记录</text>
						</dz-grid-item>
					</dz-grid>
				</view>
			</view>
		</wwj-scroll-body>
		<dz-modal
			v-model="frozenCommissionModalShow"
			:title="language.application.modalTitle"
			:content="language.profile.frozenCommissionTip"
			:show-cancel-button="false"
			:confirm-color="theme.dzBaseColor"
			@confirm="frozenCommissionModalShow = false"
		></dz-modal>
		<dz-toast ref="dzToast"></dz-toast>
	</view>
</template>

<script>
import { mapState } from 'vuex';
import uQRCode from '@/core/utils/uqrcode.js';
import painter from '@/core/utils/mp-painter';
import MescrollMixin from "@/core/components/mescroll-uni/mescroll-mixins.js";
export default {
	mixins: [MescrollMixin], // 使用mixin
	data() {
		return {
			helper: this.$api.helper,
			theme: this.$api.theme,
			language: this.$api.language,
			empty: this.$api.assetsConfig.empty,
			// promoterLevel: this.$api.assetsConfig.promoterLevel,
			scrollTop: 0,
			opacity: 0,
			memberInfo: {
				promoter: {
					is_regional_agent: 0,
					regional_agent_level: 0
				}
			},
			missingFace: this.$api.assetsConfig.missingFace,
			loadingStatus: 'loading',
			page: 1,
			guessYouLikeList: [],
			loadingShow: true,
			pageLoadingStatus: 'loading',
			postPath: '',
			posterShow: false,
			withdrawConfig: '',
			frozenCommissionModalShow: false,
			areaAgentShow: false,
			sumUnWithdraw: '',
			sumCommission: '',
			countExtend: '',
		};
	},
	computed: {
		...mapState(['userInfo']),
		navbarStyle() {
			let style = {};
			style.opacity = this.opacity;
			return style;
		},
	},
	onPageScroll(e) {
		this.scrollTop = e.scrollTop;
	},
	async onLoad() {
		uni.setNavigationBarTitle({
			title: this.$api.language.profile.promotionCenter
		});
		uni.$on('memberChange', data => {
			this.getUserPromoter();
		});
		await this.$onLaunched;
	},
	onUnload() {
		uni.$off('memberChange');
	},
	async onShow() {
		await this.$onLaunched;
		this.getUserPromoter();
	},
	// onPullDownRefresh() {
	// 	this.guessYouLikeList.length = 0;
	// 	this.page = 1;
	// 	this.getMemberIndex();
	// },
	// onReachBottom() {
	// 	if (this.loadingStatus == 'nomore') return;
	// 	this.page++;
	// 	this.getGuessYouLikeList();
	// },
	methods: {
		getUserPromoter() {
			this.$api.http.get(this.$api.apiConfig.extendInfo).then(res=>{
				// console.log("res: " + JSON.stringify(res));
				this.countExtend = res.data.countExtend;
				this.sumCommission = res.data.sumCommission;
				this.sumUnWithdraw = res.data.sumUnWithdraw;
				this.mescroll.endSuccess(0);
			}).catch(error=>{
				console.error(error);
				this.mescroll.endErr();
			});
		},
		downCallback() {
			// console.log("===========================downCallback");
			this.mescroll.resetUpScroll();
		},
		upCallback(page) {
			// console.log("=================page.num=" + page.num);
			// console.log("===============================upCallback");
			this.getUserPromoter(page.num);
		},
		
		opacityChange(e) {
			this.opacity = e.opacity;
		},
		toPage(url, data) {
			this.$api.router.push({
				route: this.$api.pagesConfig[url],
				query: {
					data: data
				}
			});
		},
		frozenCommissionClick() {
			this.frozenCommissionModalShow = true;
		},
		// 复制
		copy(val) {
			this.$api.helper.copy(val);
			this.$refs.dzToast.show({
				title: '已复制到剪贴板',
				type: 'success'
			});
		}
	}
};
</script>

<style lang="scss">
.pure_top {
	width: 100%;
	height: 160rpx;
	position: relative;
	z-index: 0;
	overflow: hidden;
}

.pure_top::after {
	content: '';
	width: 120%;
	height: 160rpx;
	position: absolute;
	left: -10%;
	top: 0;
	border-radius: 0 0 50% 50%;
}
.content {
	padding: 24rpx;
	margin-top: -160rpx;
	position: relative;
}
.user-info {
	border-radius: 20rpx;

	color: #ffffff;
	.user {
		display: flex;
		font-size: 36rpx;
		padding: 30rpx;
		.img {
			flex-shrink: 0;
			width: 120rpx;
			height: 120rpx;
			border-radius: 50%;
			overflow: hidden;
		}
		.name {
			margin-left: 20rpx;
		}
		.tag {
			display: flex;
			align-items: center;
			justify-content: center;
			height: 36rpx;
			padding: 6rpx 20rpx;
			border-radius: 0 0 36rpx 0;
			font-size: 24rpx;
			box-shadow: 0 2rpx 0.5rpx 0 rgba(0, 0, 0, 0.02), 0 1rpx 1rpx 0 rgba(0, 0, 0, 0.1), 0 2rpx 2rpx 0 rgba(0, 0, 0, 0.02);
			margin-left: 50rpx;
			position: relative;
			.icon {
				position: absolute;
				top: -16rpx;
				left: -36rpx;
				font-size: 60rpx;
			}
		}
	}
	.card {
		display: flex;
		justify-content: space-between;
		margin-top: 30rpx;
		padding: 24rpx 40rpx;
		.card-item {
			display: flex;
			flex-direction: column;
			text-align: center;
			font-size: 26rpx;
		}
	}
}
.order {
	background-color: #ffffff;
	margin-top: 24rpx;
	border-radius: 20rpx;
	overflow: hidden;
}

.icon-bg {
	display: flex;
	justify-content: center;
	align-items: center;
	width: 80rpx;
	height: 80rpx;
	border-radius: 40rpx;

	background: #f7f7f7;
}

/*海报*/
.hideCanvasView {
	position: relative;
}

.hideCanvas {
	position: fixed;
	top: -99999upx;
	left: -99999upx;
	z-index: -99999;
}

.flex_row_c_c {
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;
}

.modalView {
	width: 100%;
	height: 100%;
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	opacity: 0;
	outline: 0;
	transform: scale(1.2);
	perspective: 2500upx;
	background: rgba(0, 0, 0, 0.6);
	transition: all 0.3s ease-in-out;
	pointer-events: none;
	backface-visibility: hidden;
	z-index: 999;
}

.modalView.show {
	opacity: 1;
	transform: scale(1);
	pointer-events: auto;
}

.flex_column {
	display: flex;
	flex-direction: column;
}

.backgroundColor-white {
	background-color: white;
}

.border_radius_10px {
	border-radius: 10px;
}

.padding1vh {
	padding: 1vh;
}

.posterImage {
	width: 70vw;
}

.flex_row {
	display: flex;
	flex-direction: row;
}

.marginTop2vh {
	margin-top: 2vh;
}
</style>
