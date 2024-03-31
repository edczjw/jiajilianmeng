<template>
	<view>
		<!-- #ifndef MP-TOUTIAO -->
		<dz-navbar :title="language.product.titleProduct"></dz-navbar>
		<!-- #endif -->
		<view class="content">
			<view class="des">
				<view class="dz-font-xl dz-font-weight">{{product.name}}</view>
				<view class="dz-font-lg dz-type-warning-dark">{{product.jifen}}积分</view>
			</view>
			<!--选择地址-->
			<view class="dz-address-section" @tap="choiceAddress">
				<view class="order-content">
					<view v-if="!helper.isEmpty(addressData)" class="address">
						<view class="top">
							<text class="name">{{ addressData.realname }}</text>
							<text class="mobile">{{ helper.maskCode(addressData.phone, 3, 4) }}</text>
						</view>
						<text class="address dz-inline-1">{{ addressData.addressName }} {{ addressData.addressDetails }}</text>
					</view>
					<view class="no-default-address" v-else>{{ language.orderCreate.pleaseShippingAddress }}</view>
					<text class="dzicon-iconfont dzicon-right"></text>
				</view>
				<view class="address-bg-img"></view>
			</view>
			<view class="product-detail">
				<view class="" v-for="(item, index) in product.detailImgList" :key="index">
					<dz-image :src="helper.formatImg(item)" mode="widthFix"></dz-image>
				</view>
				<dz-divider v-show="product.detailImgList.length > 0" margin-top="20" margin-bottom="20">{{ language.product.reachBottom }}</dz-divider>
				<view class="dz-safearea-bottom"></view>
			</view>
			<!--底部操作栏-->
			<view class="dz-operation-ios">
				<view class="dz-operation">
					<view class="dz-flex-1">
						<dz-button
							:custom-style="{
								background: canExchange ? theme.dzSubColor : theme.dzTypeInfoDisabled,
								color: theme.dzBaseFontColor,
								width: '100%',
								height: '100rpx'
							}"
							hover-class="none"
							:disabled="!canExchange"
							:border="false"
							shape="rightAngle"
							@click="showPopup"
						>
							{{ canExchange ? "立即兑换" : "积分不足"}}
						</dz-button>
					</view>
				</view>
			</view>
		</view>
		<!-- <dz-loadmore v-if="loadingStatus != 'noData'" :status="loadingStatus" margin-top="20" margin-bottom="20"></dz-loadmore> -->
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
import { mapState } from 'vuex';
export default {
	data() {
		return {
			helper: this.$api.helper,
			language: this.$api.language,
			theme: this.$api.theme,
			empty: this.$api.assetsConfig.empty,
			loadingStatus: 'loading',
			page: 1,
			modalShow: false,
			modalContent: '',
			modalLoading: false,
			addressData: {},
			canExchange: false,
			product : {
				id: '',
				name: "",
				type: "",
				jifen : '',
				jifenOri : '',
				detailImgList: []
			},
		};
	},
	async onLoad(options) {
		uni.setNavigationBarTitle({
			title: this.$api.language.product.titleProduct
		});
		await this.$onLaunched;
		this.getProductDetail(options.productId);
		
		uni.$on('getAddressData', data => {
			// console.log("data: " + JSON.stringify(data));
			this.addressData = data;
		});
	},
	computed: {
		...mapState(['userInfo'])
	},
	methods: {
		getProductDetail(productId) {
			this.loadingStatus = 'loading';
			this.$api.http.get(this.$api.apiConfig.getProductDetail + productId)
			.then(res => {
				// console.log(res);
				if (res.code == 200) {
					let product = res.data;
					product.detailImgList = product.detailImgs.split(",");
					this.product = product;
					if (this.userInfo.jifen >= product.jifen) {
						this.canExchange = true;
					}
				}
				this.loadingStatus = 'nomore';
			})
			.catch(err => {
				console.error(err);
			});
		},
		exchange() {
			this.$api.http.post(this.$api.apiConfig.productExchange,
			{
				productId : this.product.id,
				addressId: this.addressData.id
			}).then(res=>{
				// console.log("res: " + JSON.stringify(res));
				if (res.code == 200) {
					this.$refs.dzToast.show({
						title: '兑换成功',
						type: 'success'
					});
					this.$api.store.dispatch('getUserInfo');
				} else {
					this.$refs.dzToast.show({
						title: res.msg,
						type: 'error'
					});
				}
			}).catch(error=>{
				console.error(error);
			})
		},
		showPopup() {
			if (this.addressData && this.addressData.id) {
				this.modalContent = "是否使用"+this.product.jifen+"积分兑换"+this.product.name;
				this.modalShow = true;
			} else {
				this.$refs.dzToast.show({
					title: '请选择收货地址',
					type: 'warning'
				});
			}
		},
		choiceAddress() {
			this.$api.router.push({
				route: this.$api.pagesConfig.address,
				query: {
					source: 'orderCreate'
				}
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
			this.exchange();
			setTimeout(() => {
				this.modalShow = false;
				this.$api.router.back();
			}, 500);
		},
	},
	onReachBottom() {
		if (this.loadingStatus == 'nomore') return;
		this.page++;
		// this.getProductDetail();
	}
};
</script>

<style lang="scss" scoped>
.des {
	display: flex;
	flex-direction: column;
	padding: 20rpx;
	background-color: #FFFFFF;
	margin-bottom: 20rpx;
	.dz-font-40 {
		font-size: 40rpx;
		color: #000000;
	}
}

.product-detail {
	display: flex;
	flex-direction: column;
	// justify-content: center;
	padding: 20rpx;
	background-color: #ffffff;
}

.dz-operation-ios {
	width: 100%;
	position: fixed;
	z-index: 10;
	bottom: 0;
	left: 0;
	background: rgba(255, 255, 255, 0.98);
	height: 100rpx;
}

.dz-operation {
	width: 100%;
	// height: 100rpx;
	background: rgba(255, 255, 255, 0.98);
	display: flex;
	align-items: center;
	justify-content: space-between;
	// margin-bottom: env(safe-area-inset-bottom);
}

.dz-safearea-bottom {
	width: 100%;
	// height: env(safe-area-inset-bottom);
	height: 100rpx;
	// margin-bottom: 20rpx;
}

.dz-operation::before {
	content: '';
	position: absolute;
	top: 0;
	right: 0;
	left: 0;
	border-top: 1rpx solid $dz-border-color;
	-webkit-transform: scaleY(0.5);
	transform: scaleY(0.5);
}

.dz-address-section {
	padding: 30rpx;
	background: #fff;
	position: relative;
	border-radius: 10rpx;
	margin-bottom: 20rpx;

	.order-content {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.no-default-address {
		color: $dz-main-color;
		font-size: 32rpx;
	}

	.dzicon-right {
		color: $dz-tips-color;
	}

	.address {
		display: flex;
		flex-direction: column;
		flex: 1;
		font-size: 28rpx;
		color: $dz-main-color;
	}

	.name {
		font-size: 34rpx;
		margin-right: 24rpx;
	}

	.mobile {
		font-size: 34rpx;
	}

	.address {
		font-size: 24rpx;
		margin-top: 16rpx;
		margin-right: 20rpx;
		color: $dz-main-color;
	}

	.address-bg-img {
		position: absolute;
		width: 100%;
		height: 8rpx;
		left: 0;
		bottom: 0;
		background: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAL0AAAAECAMAAADszM6/AAAAOVBMVEUAAAAVqfH/fp//vWH/vWEVqfH/fp8VqfH/fp//vWEVqfH/fp8VqfH/fp//vWH/vWEVqfH/fp//vWHpE7b6AAAAEHRSTlMA6urqqlVVFRUVq6upqVZUDT4vVAAAAEZJREFUKM/t0CcOACAQRFF6r3v/w6IQJGwyDsPT882IQzQE0E3chToByjG5LwMgLZN3TQATmdypCciBya0cgOT3/h//9PgF49kd+6lTSIIAAAAASUVORK5CYII=')
			repeat;
	}
}
</style>
