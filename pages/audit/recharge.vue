<template>
	<view>
		<dz-navbar title="充值中心" :borderBottom="false"></dz-navbar>
		<view class="head">
			<view class="dz-p-20 dz-text-center dz-font-weight dz-font-lg" :style="{ color: theme.dzBaseColor }">金币余额：{{ userInfo.coin }}</view>
			<dz-line></dz-line>
			<view v-if="itemList.length > 0">
				<dz-row gutter="16">
					<dz-col span="4" v-for="(item, index) in itemList" :key="index" @click="quickClick(index)">
						<view
							class="layout"
							:style="{
								background: index == rechargeQuickIndex ? '#fff' : theme.dzBgColor,
								borderColor: index == rechargeQuickIndex ? theme.dzBaseColor : theme.dzBgColor,
								color: index == rechargeQuickIndex ? theme.dzBaseColor : '#333'
							}"
						>
							<view class="dz-font-md dz-text-center">{{ item.coin }}币</view>
							<view class="dz-font-sm dz-text-center dz-color-9">
								￥{{item.price}}
							</view>
						</view>
					</dz-col>
				</dz-row>
			</view>
			<view>
				<text class="dz-p-l-10">充值金额   {{inputAmount}}</text>
			</view>
			<!-- <view class="dz-flex dz-row-center dz-p-30 dz-font-24">
				<dz-checkbox v-model="agreeCheck" shape="circle" size="30" :active-color="theme.dzBaseColor">
					<text class="dz-font-24 dz-color-9">已经阅读并且同意</text>
				</dz-checkbox>
				<text :style="{ marginLeft: '-20rpx', color: theme.dzTypePrimary }" @tap.stop="protocal('充值协议', 'recharge')">《用户充值协议》</text>
			</view> -->
		</view>
		<!-- <view class="pay-type-list">
			<dz-cell-item
				v-if="parseInt(payConfig[`pay_${payGroup}_wechatpay`]) > 0"
				:borderBottom="false"
				center
				hoverClass="none"
				:arrow="false"
				:title="language.orderPay.wechatPay"
				icon="wechat"
				iconSize="60"
				:icon-style="{ color: '#42E38D', 'margin-right': '30rpx' }"
				@click="checkboxChange(1)"
			>
				<dz-checkbox :active-color="theme.dzBaseColor" :value="checkType === 1 ? true : false" shape="circle" @change="checkboxChange(1)"></dz-checkbox>
			</dz-cell-item>
			<dz-cell-item
				v-if="parseInt(payConfig[`pay_${payGroup}_alipay`]) > 0"
				:borderBottom="false"
				center
				:arrow="false"
				hoverClass="none"
				:title="language.orderPay.aliPay"
				icon="alip"
				iconSize="60"
				:icon-style="{ color: '#2EAFFF', 'margin-right': '30rpx' }"
				@click="checkboxChange(2)"
			>
				<dz-checkbox :active-color="theme.dzBaseColor" :value="checkType === 2 ? true : false" shape="circle" @change="checkboxChange(2)"></dz-checkbox>
			</dz-cell-item>
			<dz-cell-item
				v-if="parseInt(payConfig[`pay_${payGroup}_quick`]) > 0"
				:borderBottom="false"
				center
				hoverClass="none"
				:arrow="false"
				:title="language.orderPay.quickPay"
				icon="card_fill"
				iconSize="60"
				:icon-style="{ color: '#2EAFFF', 'margin-right': '30rpx' }"
				@click="checkboxChange(8)"
			>
				<dz-tag slot="label" type="info" mode="plain" size="mini" icon="unfold" @click="choiceBankcardClick">
					{{ allinpayCardList.length > 0 ? allinpayCardList[allinpayBankcardIndex].account_number : language.orderPay.bankcardEmpty }}
				</dz-tag>
				<dz-checkbox :active-color="theme.dzBaseColor" :value="checkType === 8 ? true : false" shape="circle" @change="checkboxChange(8)"></dz-checkbox>
			</dz-cell-item>
		</view> -->
		<view class="footer">
			<view class="footer-btn">
				<view style="width: 90%;">
					<dz-button
						:custom-style="{ background: submitting ? theme.dzBaseDisabled : theme.dzBaseColor, color: theme.dzBaseFontColor }"
						hover-class="none"
						shape="circle"
						:border="false"
						:loading="submitting"
						@click="toPay"
					>
						确定支付
					</dz-button>
				</view>
			</view>
		</view>
		<!-- 页面加载 -->
		<!-- <dz-page-loading :show="pageLoadingShow" :status="pageLoadingStatus" @click="pageLoadingClick"></dz-page-loading> -->
		<dz-toast ref="dzToast"></dz-toast>
	</view>
</template>

<script>
/**
 * ***********************************************************************************
 * 所有支付页面必须引入mixin,pay.js
 * ***********************************************************************************
 */
// import pay from '@/core/utils/mixin/pay.js';
import { mapState, mapGetters, mapMutations } from 'vuex';
export default {
	// mixins: [pay],
	data() {
		return {
			theme: this.$api.theme,
			submitting: false,
			pageLoadingStatus: 'loading',
			pageLoadingShow: true,
			itemList: [], //快捷充值列表
			rechargeQuickIndex: -1, //快捷充值选择索引
			inputAmount: '',
			inputAmountGive: '',
			rechargeMoney: 0,
			agreeCheck: true,
			inappPurchase: false,
			carouselList: [],
			iapChannel: null,
			productIds: [],
			optionCardItems: []
		};
	},
	computed: {
		...mapState(['userInfo'])
	},
	async onLoad(e) {
		// this.orderGroup = 'recharge';
		// this.rechargeMoney = e.recharge;
		// this.apiUrl = this.$api.apiShop.payCreate;
		this.initOrder();
	},
	onShow() {},
	onHide() {
		uni.hideLoading();
	},
	methods: {
		//协议
		protocal(title, field) {
			this.$api.router.push({
				route: this.$api.routesConfig.aboutProtocol,
				query: {
					title,
					field
				}
			});
		},
		//充值选择
		quickClick(index, item) {
			this.rechargeQuickIndex = index;
			this.inputAmount = this.itemList[index].price;
			// this.inputAmountGive = this.itemList[index].give_price;
		},
		async initOrder() {
			// 获取快捷充值列表
			await this.$api.http
				.get(this.$api.apiConfig.getRechargeOptions)
				.then(res => {
					console.log(res);
					this.itemList = res.optionMap.standard;
					this.optionCardItems = res.optionMap.optionCard;
					if (this.itemList.length > 0) {
						this.rechargeQuickIndex = 0;
						this.inputAmount = this.itemList[0].price;
						// this.inputAmountGive = this.itemList[0].give_price;
					}
					
					if (this.$api.systemInfo.platform == 'ios' && res.inappPurchase) {
						console.log("===========================inappPurchase");
						this.inappPurchase = true;
						this.productIds = res.optionMap.iosProductids;
						console.log(res.optionMap.iosProductids);
						this.getChannels();
					}
				})
				.catch(err => {
					this.pageLoadingStatus = 'error';
					return;
				});
			this.pageLoadingShow = false;
			// if (this.auto && this.auto == 'wechat') {
			// 	this.checkType = 1;
			// 	this.paySubmit();
			// }
		},
		//支付提交
		paySubmit() {
			if (!this.agreeCheck) {
				this.$refs.dzToast.show({
					title: '请仔细阅读并勾选用户充值协议',
					type: 'warning'
				});
				return;
			}
			if (this.submitting) {
				return;
			}
			if (!this.$api.helper.isNumber(this.inputAmount)) {
				this.$refs.dzToast.show({
					title: '请输入正确充值金额',
					type: 'warning'
				});
				return;
			}
			if (parseFloat(this.inputAmount) <= 0) {
				this.$refs.dzToast.show({
					title: '请输入正确充值金额',
					type: 'warning'
				});
				return;
			}
			if (this.checkType <= 0) {
				this.$refs.dzToast.show({
					title: '请选择支付方式',
					type: 'warning'
				});
				return;
			}
			this.submitting = true;
			this.orderInfo.money = parseFloat(this.inputAmount);
			this.wxAutoParam = { recharge: this.inputAmount };
			this.submitQuery = {
				id: this.id,
				orderGroup: this.orderGroup
			};
			if (this.checkType === 8) {
				//快捷支付
				this.quickPaySubmit();
			} else if (this.checkType === 1) {
				//微信支付
				this.wechatPaySubmit();
			} else if (this.checkType === 2) {
				//支付宝支付
				this.aliPaySubmit();
			}
		},
		toPay() {
			this.submitting = true;
			let item = this.itemList[this.rechargeQuickIndex];
			this.requestAppleiapInfo(item.iosProductid, item.id);
		},
		getChannels() {
			// #ifdef APP-PLUS
			plus.payment.getChannels((channels) => {
				for (var i in channels) {
					var channel = channels[i];
					if (channel.id === 'appleiap') {
						this.iapChannel = channel;
						this.requestOrder();
					}
				}
				if(!this.iapChannel){
					// this.errorMsg()
				}
			}, (error) => {
				// this.errorMsg()
				console.error(error)
			});
			// #endif
		},
		requestOrder() {
			console.log("--------------------------------requestOrder-------------------------------------");
			// uni.showLoading({
			// 	title:'检测支付环境...'
			// })
			this.iapChannel.requestOrder(this.productIds, (orderList) => { //必须调用此方法才能进行 iap 支付
				// uni.hideLoading();
			}, (e) => {
				console.error(e);
				// uni.hideLoading();
				// this.errorMsg()
			});
		},
		// 请求苹果支付相关参数
		requestAppleiapInfo(iosProductid,rechargeOptionId) {
			uni.showLoading({
				title:'支付中...'
			})
			// let url = `payment/pay?paymethodId=3&rechargeOptionId=` + rechargeOptionId;
			this.$api.http.get(this.$api.apiConfig.pay, {
				paymethodId: 3,
				rechargeOptionId: rechargeOptionId
			}).then(res=>{
				console.log(res);
				if(res.code==200){
					this.appleIap(iosProductid, res.data);
				} else {
					uni.showModal({
						content: res.msg,
						showCancel: false
					})
					uni.hideLoading();
				}
			}).catch(err=>{
				console.log(err);
				uni.hideLoading();
			})
		},
		// 苹果内购
		appleIap(iosProductid, data){
			let self = this;
			uni.requestPayment({
				provider: 'appleiap',
				orderInfo: {
					productid: iosProductid,
					username: self.userInfo.nick,
					optimize: true 
				},
				success: (result) => {
					self.$api.http.post(self.$api.apiConfig.iosInappRecharge, {
						rechargeId: data.rechargeId,
						receipt: result.transactionReceipt
					}).then(res=>{
						if(res.code==200){
							self.$api.store.dispatch('getUserInfo');
							uni.showModal({
								content: "充值已到账",
								showCancel: false
							})
						} else {
							uni.showModal({
								content: res.msg,
								showCancel: false
							})
						}
					})
				},
				fail: () => {
					uni.showModal({
						content: "支付失败",
						showCancel: false
					})
				},
				complete: () => {
					console.log("payment结束")
					uni.hideLoading();
				}
			})
		},
		errorMsg(){
			uni.showModal({
				content: "暂不支持苹果 iap 支付",
				showCancel: false
			})
		},
		//收银台支付返回路径
		returnPath() {
			let domain = this.$api.shopSetting.h5_url;
			let url = '';
			if (domain.endsWith('/')) {
				domain = domain.substr(0, domain.length - 1);
			}
			url = `${domain}${this.$api.routesConfig.payComplete.path}?type=recharge`;
			return url;
		}
	}
};
</script>

<style lang="scss" scoped>
.head {
	background-color: #ffffff;
	margin: 24rpx;
	padding: 10rpx 20rpx;
	border-radius: 20rpx;
}
.layout {
	margin: 20rpx 0;
	padding: 10rpx;
	border-radius: 20rpx;
	border: 1rpx solid #fff;
}
.pay-type-list {
	background-color: #ffffff;
	margin: 24rpx;
	padding: 10rpx 0;
	border-radius: 20rpx;
	overflow: hidden;
}
.footer {
	width: 100%;
	position: fixed;
	z-index: 99;
	background-color: #fff;
	bottom: 0;
}
.footer-btn {
	width: 100%;
	height: 120rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-bottom: env(safe-area-inset-bottom);
}
.bankcardList {
	padding: 30rpx;
}
.bankcardTip {
	padding-bottom: 20rpx;
}
.link {
	text-decoration: none;
}
</style>
