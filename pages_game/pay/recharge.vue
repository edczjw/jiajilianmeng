<template>
	<view class="bg-white">
		<!-- #ifndef MP-TOUTIAO -->
		<dz-navbar title='充值中心' :border-bottom="false"></dz-navbar>
		<!-- #endif -->
		<view elevation="20rpx" class="p-2 bg-white mx-2 box-shadow-card" style="border-radius: 20rpx;">
			<u-swiper v-if="carouselList && carouselList.length > 0" :list="carouselList" keyName="img" height="250rpx"
				indicator indicatorMode="line" circular radius="20"
				duration="800" imgMode="scaleToFill" bgColor="#fff"></u-swiper>
			<!-- <image src="../../static/pay/banner.png" style="height: 250rpx;border-radius: 20rpx;" mode=""></image> -->
			<view class="flex flex-row j-sb mt-2">
				<view class="flex flex-row j-center a-center">
					<u-avatar :src="utils.formatImg(userInfo.icon) || missingFace" size="80"></u-avatar>
					<view class="flex flex-column ml-2">
						<view class="">
							<text class="font-md">我的金币:</text>
							<text class="font-md font-weight">{{ userInfo.coin || 0 }}</text>
						</view>
						<!-- <view class="">
							<text class="font-smd" :style="{color:theme.dzLightColor}">如何获得积分？</text>
						</view> -->
					</view>
				</view>
				<view class="flex flex-row j-center a-center" @tap="toDetails">
					<text>金币明细</text>
					<u-icon name="arrow-right"></u-icon>
				</view>
			</view>
		</view>
		<view class="m-3">
			<view class="recharge-card flex flex-wrap">
				<view class="ic-item position-relative m-2 rounded-20" v-for="(item, index) in optionCardItems" :key="index" @tap="toPay(item)">
					<view class="recharge-card-title">
						<text :style="{color:item.color}">{{item.tag}}</text>
					</view>
					<view class="coin-content">
						<text class="gui-color-white coin-content-text">{{item.coin}}币</text>
					</view>
					<view class="desc-content">
						<text class="gui-color-white desc-content-text">{{item.desc}}</text>
					</view>
				
					<view class="recharge-card-price">
						<text>￥{{item.price}}</text>
					</view>
				</view>
			</view>
			<dz-gap :height="30"></dz-gap>
			<view class="recharge-normal flex flex-wrap">
				<view class="ic-item position-relative m-2" v-for="(item, index) in itemList" :key="index" @tap="toPay(item)">
					<view class="ic-item">
						<view v-if="item.desc" class="recharge-title">
							<text>{{item.desc}}</text>
						</view>
						<view :class="item.desc ? 'coin-content' : 'coin-content-notip'">
							<text class="gui-color-white coin-content-text">{{item.coin}}币</text>
						</view>
								
						<view class="recharge-card-price">
							<text>￥{{item.price}}</text>
						</view>
					</view>
				</view>
			</view>
			<dz-gap :height="20"></dz-gap>
		</view>
		
		<u-popup :show="payShow" :round="40" mode="bottom"  @close="payPopClose">
			<view class="m-2" style="height: 500rpx;text-align: center;">
				<text style="text-align: center;font-size: 52rpx;font-weight: 900;">￥{{selectItem ? selectItem.price : 0}}</text>
				
				<view class="pay-type-list">
					<view v-for="(item, index) in payMethods" :key="index" class="type-item b-b" @click="changePayType(index)">
						<image :src="utils.formatImg(item.icon)" style="width: 60rpx;height:60rpx;"></image>
						<view class="con">
							<view class="tit">{{item.name}}<text v-if="item.giveCoin && item.giveCoin > 0" class="recommand">加送{{item.giveCoin}}币</text></view>
						</view>
						<label class="radio">
							<radio value="" color="#fa436a" :checked='payType == index' />
							</radio>
						</label>
					</view>
				</view>
				
				<view class="recharge-btn" @click="confirmPay">立即充值</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	var webView;//计划创建的webview
	var orderNo; //订单号
	import {
		mapState,
		mapGetters
	} from 'vuex';
	export default {
		data() {
			return {
				payType: 0,
				theme: this.$api.theme,
				lineBg: this.$api.assetsConfig.tabindicator,
				missingFace: this.$api.assetsConfig.missingFace,
				utils: uni.$api.helper,
				payMethods: [],
				payShow: false,
				itemList: [],
				inappPurchase: false,
				carouselList: [],
				iapChannel: null,
				productIds: [],
				optionCardItems: [],
				selectItem: null,
				orderInfo: {},
			}
		},
		async onLoad() {
			this.loadData();
		},
		computed: {
			...mapState(['userInfo'])
		},
		onShow() {
			if(orderNo){
				setTimeout(()=>{
					this.$api.http.get(this.$api.apiConfig.checkOrderStatus + orderNo).then(res => {
						this.paySuccess();
					}).catch(err => {
						console.log(err)
					});
					orderNo = null;
				}, 300)
			}
			// #ifdef APP-PLUS
			if(webView){
			    plus.webview.close(webView);
			    webView = null;
			}
			// #endif
		},
		onHide() {
			uni.hideLoading();
		},
		methods: {
			loadData() {
				uni.$api.http.get(uni.$api.apiConfig.getBanner + "rechargeTop").then(res => {
					if(res.data && res.data.rechargeTop){
						this.carouselList = res.data.rechargeTop;
						this.carouselList.forEach((item, index) => {
							this.$set(item, "img", uni.$api.helper.formatImg(item.img));
						});
					}else {
						this.carouselList = [];
					}
				}).catch(err=>{
					console.log(err);
				});
				
				
				this.$api.http.get(this.$api.apiConfig.getRechargeOptions).then(res => {
					console.log(res);
					// console.log("res: " + JSON.stringify(res));
					if (this.$api.systemInfo.platform == 'ios' && res.inappPurchase) {
						console.log("===========================inappPurchase");
						this.inappPurchase = true;
						this.productIds = res.optionMap.iosProductids;
						console.log(res.optionMap.iosProductids);
						this.getChannels();
					}

					this.itemList = res.optionMap.standard;
					this.optionCardItems = res.optionMap.optionCard;
				}).catch(err => {
					console.log(err)
				});
				
				this.$api.http.get(this.$api.apiConfig.getPayMethodList).then(res => {
					console.log(res);
					this.payMethods = res.data;
				}).catch(err => {
					console.log(err)
				});
			},
			changePayType(index) {
				this.payType = index;
			},
			toPay(item) {
				this.$api.helper.toast('敬请期待')
				return
				if(this.inappPurchase) {
					this.requestAppleiapInfo(item.iosProductid, item.id);
				} else {
					this.payShow = true
					this.selectItem = item
				}
			},
			payPopClose() {
				this.payShow = false
				// console.log('close');
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
						console.log('22222222')
						this.errorMsg()
					}
				}, (error) => {
					console.log('333333333')
					this.errorMsg()
				});
				// #endif
			},
			requestOrder() {
				console.log("--------------------------------requestOrder-------------------------------------");
				uni.showLoading({
					title:'检测支付环境...'
				})
				this.iapChannel.requestOrder(this.productIds, (orderList) => { //必须调用此方法才能进行 iap 支付
					uni.hideLoading();
				}, (e) => {
					console.log(e, '11111111111111');
					uni.hideLoading();
					this.errorMsg()
				});
			},
			// 请求苹果支付相关参数
			requestAppleiapInfo(iosProductid,rechargeOptionId) {
				uni.showLoading({
					title:'正在支付...'
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
					}
				}).catch(err=>{
					console.log(err);
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
			confirmPay(){
			    // if (this.showLoading) return;
				uni.showLoading({
					title: "正在支付..."
				})
			    this.payShow = false
			    let paymethodId = this.payMethods[this.payType].id;
				
			    // #ifdef APP-PLUS
				if(this.$api.systemInfo.platform == 'ios'){
					let url = this.$api.apiConfig.webpayForm + `?paymethodId=${paymethodId}&rechargeOptionId=${this.selectItem.id}`
					this.$api.http.get(url).then(res => {
						orderNo = res.data.rechargeId;
						this.webPay(res.data.form);
						uni.hideLoading();
					}).catch(err => {
						uni.showToast({
							title: res.msg,
							icon: 'none'
						});
						uni.hideLoading();
					});
				}else {
					let url = this.$api.apiConfig.pay + `?paymethodId=${paymethodId}&rechargeOptionId=${this.selectItem.id}`
					this.$api.http.get(url).then(res => {
						// console.log(res);
						orderNo = res.data.rechargeId;
						this.pay(res.data.payPath);
						uni.hideLoading();
					}).catch(err => {
						uni.showToast({
							title: res.msg,
							icon: 'none'
						});
						uni.hideLoading();
					});
				}
			    // #endif
			},
			pay(orderInfo){
				let provider = this.payMethods[this.payType].remark;
			    uni.requestPayment({
			        provider: provider,
			        orderInfo: orderInfo,
			        success: (res) => {
						// console.log(res);
						// this.paySuccess();
			        },
					fail: (res) => {
			            // console.log(res);
					},
					complete: (res) => {
			            // console.log(res);
			            // this.showLoading = false;
					}
			    });
			},
			webPay(url){
			    // #ifdef APP-PLUS
			    webView = plus.webview.create("","custom-webview",{
			        plusrequire:"none", //禁止远程网页使用plus的API，有些使用mui制作的网页可能会监听plus.key，造成关闭页面混乱，可以通过这种方式禁止
			        'uni-app': 'none', //不加载uni-app渲染层框架，避免样式冲突
			        // 'kernel': 'UIWebview',
			        top:uni.getSystemInfoSync().statusBarHeight+44 ,//放置在titleNView下方。如果还想在webview上方加个地址栏的什么的，可以继续降低TOP值
			        additionalHttpHeaders:{Referer:'www.fstaolege.com://'}
			    })
			    // webView.loadURL(url, {Referer:'www.fstaolege.com://'});
			    webView.loadData(url, {baseURL:"http://api.fstaolege.com"});
			    var currentWebview = this.$scope.$getAppWebview(); //此对象相当于html5plus里的plus.webview.currentWebview()。在uni-app里vue页面直接使用plus.webview.currentWebview()无效
			    currentWebview.append(webView);//一定要append到当前的页面里！！！才能跟随当前页面一起做动画，一起关闭
			    // #endif
			},
			paySuccess() {
			    this.$store.dispatch('getUserInfo');
				uni.showModal({
					content: "充值已到账",
					showCancel: false
				})
			},
			onBack(){
			    uni.navigateBack();
			},
			toDetails(){
				if (!this.$api.store.getters.hasLogin) {
					return;
				}
				this.$api.router.push({
					route: this.$api.pagesConfig["bill"],
					query: {}
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
	 .recharge-card{
		.ic-item {
			width: 305rpx;
			height: 220rpx;
			font-size: 0;
			border-radius: 15px;
			box-shadow: 0rpx 0rpx 30rpx rgba(0, 0, 0, 0.2);
		}
		
		.coin-content {
			position: absolute;
			left: 10rpx;
			bottom: 10rpx;
			color: #d18b00;
			font-size: 34rpx;
			font-weight: bold;
			background-color: #fff6f4;
			border-radius: 20rpx;
			width: 130rpx;
			height: 60rpx;
			text-align: center;
			line-height: 60rpx;
		}
		
		.desc-content {
			position: absolute;
			left: 20rpx;
			top: 75rpx;
			width: 280rpx;
		}
		
		.recharge-card-price {
			position: absolute;
			right: 10rpx;
			bottom: 10rpx;
			color: #FF6144;
			font-size: 36rpx;
			font-weight: bold;
			background-color: #fff6f4;
			border-radius: 20rpx;
			width: 130rpx;
			height: 60rpx;
			text-align: center;
			line-height: 60rpx;
		}
		
		.recharge-card-title {
			position: absolute;
			left: 0rpx;
			top: 0rpx;
			width: 190rpx;
			height: 60rpx;
			font-size: 36rpx;
			font-weight: bold;
			background-color: #f1e9e7;
			border-radius: 20rpx 0rpx 20rpx 0rpx;
			text-align: center;
			line-height: 60rpx;
		}
		
		.coin-content-text {
			font-size: 32rpx;
			line-height: 50rpx;
			font-weight: bold;
		}
		
		.desc-content-text {
			font-size: 26rpx;
			line-height: 30rpx;
		}
	}
	
	.recharge-normal{
		.ic-item {
			width: 190rpx;
			height: 170rpx;
			/* padding: 20rpx; */
			font-size: 0;
			border-radius: 15px;
			box-shadow: 0 8upx 16upx rgba(114, 130, 138, 0.2);
		}
		
		.recharge-title {
			position: absolute;
			left: 0rpx;
			top: 0rpx;
			width: 190rpx;
			height: 30rpx;
			color: #838383;
			font-size: 24rpx;
			font-weight: bold;
			background-color: #fff6f4;
			border-radius: 20rpx 20rpx 0rpx 0rpx;
			text-align: center;
			line-height: 30rpx;
		}
		
		.coin-content {
			position: absolute;
			left: 10rpx;
			top: 40rpx;
			color: #d18b00;
			font-size: 38rpx;
			font-weight: bold;
			// background-color: #fff6f4;
			border-radius: 20rpx;
			width: 170rpx;
			height: 60rpx;
			text-align: center;
			line-height: 60rpx;
		}
		
		.coin-content-notip {
			position: absolute;
			left: 10rpx;
			top: 25rpx;
			color: #d18b00;
			font-size: 42rpx;
			font-weight: bold;
			// background-color: #fff6f4;
			border-radius: 20rpx;
			width: 170rpx;
			height: 60rpx;
			text-align: center;
			line-height: 60rpx;
		}
		
		
		.recharge-card-price {
			position: absolute;
			right: 0rpx;
			bottom: 0rpx;
			color: #FF6144;
			font-size: 34rpx;
			font-weight: bold;
			background-color: #fff6f4;
			border-radius: 0 0 20rpx 20rpx;
			width: 190rpx;
			height: 60rpx;
			text-align: center;
			line-height: 60rpx;
		}
	}
	
	.pay-type-list {
		margin-top: 20upx;
		background-color: #fff;
		padding-left: 60upx;
		
		.type-item{
			height: 120upx;
			padding: 20upx 0;
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding-right: 60upx;
			font-size: 30upx;
			position:relative;
		}
		
		.icon{
			width: 100upx;
			font-size: 52upx;
		}
		.icon-erjiye-yucunkuan {
			color: #fe8e2e;
		}
		.icon-weixinzhifu {
			color: #36cb59;
		}
		.tit{
			font-size: 36rpx;
			color: #000000;
			margin-bottom: 4upx;
		}
		.con{
			flex: 1;
			display: flex;
			flex-direction: column;
			font-size: 30rpx;
			color: #b3ff97;
		}
		.recommand {
			margin-left: 5rpx;
			font-size: 24rpx;
			background-color: #ffcb47;
			padding: 5rpx;
			border-radius: 10rpx;
			line-height: 60rpx;
		}
	}
	
	
	.recharge-btn {
		margin-top: 30rpx;
		margin-left: 60rpx;
		padding: 6rpx;
		width: 600rpx;
		font-size: 38rpx;
		background-color: #fe8e2e;
		border-radius: 30rpx;
		color: #ffffff;
		box-shadow: 0rpx 0rpx 30rpx rgba(0, 0, 0, 0.2);
	}
</style>
