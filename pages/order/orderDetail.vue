<template>
	<view>
		<dz-navbar-immersive splitLine scrollRatio="0.3" :isCustom="true" @change="opacityChange" :scrollTop="scrollTop" backgroundColor="#fff" :style="[navbarStyle]">
			<dz-navbar title="订单详情"></dz-navbar>
		</dz-navbar-immersive>
		<dz-navbar
			:title="'订单详情'"
			:is-fixed="false"
			:background="{ background: theme.dzBaseColor }"
			:border-bottom="false"
			:back-icon-color="theme.dzBaseFontColor"
			:title-color="theme.dzBaseFontColor"
		></dz-navbar>
		<view class="content">
			<view class="status" :style="{ background: theme.dzBaseColor }">
				<view class="status-box">
					<view class="left">
						<!-- 已付款 -->
						<view
							v-if="[1].indexOf(parseInt(orderDetail.status)) != -1"
							class="dzicon-iconfont dzicon-presentfill icon-size"
							:style="{ color: theme.dzBaseDisabled }"
						></view>
						<!-- 已收货 -->
						<view
							v-if="[3].indexOf(parseInt(orderDetail.status)) != -1"
							class="dzicon-iconfont dzicon-baoguo_shouhuo icon-size"
							:style="{ color: theme.dzBaseDisabled }"
						></view>
						<!-- 发货中 -->
						<view
							v-if="[2].indexOf(parseInt(orderDetail.status)) != -1"
							class="dzicon-iconfont dzicon-deliver_fill icon-size"
							:style="{ color: theme.dzBaseDisabled }"
						></view>
						<view class="tip" :style="{ color: theme.dzBaseFontColor }">
							<!-- <view class="pay" v-if="orderDetail.product[0].refund_status != 0">售后处理</view> -->
							<view class="pay">{{ orderStatusFilter(orderDetail.status) }}</view>
						</view>
					</view>
					<view class="right">
						<dz-button
							v-if="parseInt(orderDetail.status) == 2"
							:plain="true"
							size="medium"
							shape="circle"
							:custom-style="{ background: theme.dzBaseLight, borderColor: theme.dzBaseDisabled, color: theme.dzBaseColor, width: '160rpx' }"
							hover-class="none"
							:border="false"
							@click="orderTakeDelivery"
						>
							确定收货
						</dz-button>
					</view>
				</view>
			</view>
			<view class="order-detail">
				<!-- 物流配送 -->
				<view class="address">
					<view class="dzicon-iconfont dzicon-round_location_fill"></view>
					<view>
						<view class="title">{{ orderDetail.reviceName }} {{ orderDetail.revicePhone }}</view>
						<view class="address-tip">{{ orderDetail.reviceAddr }}</view>
					</view>
				</view>
				<view class="product">
					<view
						class="logistics"
						v-if="[2, 3, 4, 12].indexOf(parseInt(orderDetail.status)) != -1 && orderDetail.is_virtual != -1 && orderDetail.shipping_type == 1"
					>
						<view class="logistics-l" @tap="toPage('shipping', orderDetail.id)">
							<view class="logistics-tetle">物流信息</view>
							<view class="courier"></view>
						</view>
						<view class="dzicon-iconfont dzicon-right"></view>
					</view>
					<view class="cell-item">
						<view class="order">
							<dz-tag class="dz-m-r-10" :bg-color="theme.dzBaseColor" :color="theme.dzBaseFontColor" mode="dark" size="mini" v-if="isPickupOrder(orderDetail, 1)">
								提货订单
							</dz-tag>
							<view class="order-tetle">订单编号</view>
							<view class="order-num">{{ orderDetail.orderNo }}</view>
						</view>
						<!-- <view class="order-btn">
							<dz-button
								:plain="true"
								type="info"
								size="mini"
								shape="circle"
								hoverClass="none"
								:border="false"
								:custom-style="{ height: '40rpx', background: '#FFF', lineHeight: '40rpx', border: '1rpx solid rgba(0,0,0,0.12)' }"
								@click="copy(orderDetail.orderNo)"
							>
								复制
							</dz-button>
						</view> -->
					</view>
					<block v-for="(item, index) in orderDetail.orderItemVos" :key="index">
						<view class="order-item" @tap="toProductDetail(item)">
							<view class="left">
								<view class="image"><dz-image :src="helper.formatImg(item.productThumbnail)" borderRadius="10" width="120" height="120"></dz-image></view>
								<view class="title">
									<view class="name">
										<dz-tag
											class="dz-m-r-10"
											:bg-color="theme.dzBaseColor"
											:border-color="theme.dzBaseColor"
											:color="theme.dzBaseFontColor"
											mode="dark"
											size="mini"
											:show="parseInt(item.gift_flag) > 0 ? true : false"
											:text="language.orderCreate.giveaways"
										></dz-tag>
										{{ item.productName }}
									</view>
								</view>
							</view>
						</view>
					</block>
				</view>
				<view class="cell-box">
					<dz-cell-item center title="下单时间" :arrow="false" :value="orderDetail.createTime" :border-bottom="false" hover-class="none"></dz-cell-item>
					<dz-cell-item center title="快递公司" :arrow="false" :value="orderDetail.deliveryName || '等待配送'" :border-bottom="false" hover-class="none"></dz-cell-item>
					<dz-cell-item v-if="orderDetail.deliveryName" center title="快递单号" :arrow="false" :value="orderDetail.deliveryCode" :border-bottom="false" hover-class="none" @click="copy(orderDetail.deliveryCode)"></dz-cell-item>
				</view>
				
				<view class="track">
					<dz-time-line v-if="orderDetail.track">
						<block v-for="(item, index) in orderDetail.track" :key="index">
							<dz-time-line-item nodeTop="2" v-if="index == 0">
								<!-- 此处自定义了左边内容，用一个图标替代 -->
								<template v-slot:node>
									<view class="dz-node" :style="{ background: theme.dzBaseColor }"><dz-icon name="deliver_fill" color="#fff" :size="46"></dz-icon></view>
								</template>
								<template v-slot:content>
									<view>
										<!-- <view class="dz-order-title">待取件</view> -->
										<view class="dz-order-desc">{{ item.context }}</view>
										<view class="dz-order-time">{{ item.time }}</view>
									</view>
								</template>
							</dz-time-line-item>
							<dz-time-line-item v-else>
								<!-- 此处没有自定义左边的内容，会默认显示一个点 -->
								<template v-slot:content>
									<view>
										<view class="dz-order-desc">{{ item.context }}</view>
										<view class="dz-order-time">{{ item.time }}</view>
									</view>
								</template>
							</dz-time-line-item>
						</block>
					</dz-time-line>
					<dz-empty v-if="!orderDetail.track" margin-top="80" text="暂无物流信息" :src="emptyOrder" iconSize="360"></dz-empty>
				</view>
			</view>
		</view>
		<!-- 页面加载 -->
		<dz-page-loading :show="pageLoadingShow" :status="pageLoadingStatus" @click="pageLoadingClick"></dz-page-loading>
		<!-- 确定收货提醒 -->
		<dz-modal
			v-model="isShow"
			:mask-close-able="false"
			title="确认收货"
			content="请确定在收到商品后操作哦"
			:confirm-color="theme.dzBaseColor"
			:show-cancel-button="true"
			@cancel="takeDeliveryCancel"
			@confirm="takeDeliveryConfirm"
		></dz-modal>
		<!-- 取消订单提醒 -->
		<dz-modal
			v-model="closeShow"
			:mask-close-able="false"
			content="确定要取消该订单"
			:confirm-color="theme.dzBaseColor"
			:show-cancel-button="true"
			@cancel="orderCloseCancel"
			@confirm="orderCloseConfirm"
		></dz-modal>
		<!-- 取消退款提醒 -->
		<dz-modal
			v-model="cancelRefundShow"
			:mask-close-able="false"
			content="取消退款后将无法再次提交申请，是否继续取消退款?"
			:confirm-color="theme.dzBaseColor"
			:show-cancel-button="idShowCancel"
			@cancel="cancelRefundCancel"
			@confirm="cancelRefundConfirm"
		></dz-modal>
		<dz-modal
			v-model="salesDeliveryModalShow"
			:mask-close-able="false"
			content="是否确认已经收到货？"
			:confirm-color="theme.dzBaseColor"
			:show-cancel-button="true"
			@cancel="salesDeliveryCancel"
			@confirm="salesDeliveryConfirm"
		></dz-modal>
		<!-- 提货码 -->
		<dz-popup v-model="pickupShow" mode="center" border-radius="30" :closeable="true" width="80%" :custom-style="{ overflow: 'visible' }">
			<view class="popup-box">
				<image @longpress="long" :src="imgSrc" mode=""></image>
				<view class="tip dz-m-t-20">提货码 {{ orderDetail.pickup_code }}</view>
			</view>
		</dz-popup>
		<canvas class="hideCanvas" canvas-id="qrcode" style="width: 250px;height: 250px;" />
		<dz-modal
			v-model="downloadShow"
			:mask-close-able="false"
			:confirm-color="theme.dzBaseColor"
			:show-cancel-button="false"
			:async-close="true"
			:content="`正在下载（${downloadText}）`"
			@confirm="downloadCancel"
			:confirm-text="'取消'"
		></dz-modal>
		<dz-toast ref="dzToast"></dz-toast>
	</view>
</template>

<script>
import uQRCode from '@/core/utils/uqrcode.js';
export default {
	data() {
		return {
			helper: this.$api.helper,
			theme: this.$api.theme,
			language: this.$api.language,
			emptyOrder: this.$api.assetsConfig.emptyOrder,
			orderId: '',
			orderDetail: {},
			pageLoadingShow: false,
			pageLoadingStatus: 'loading',
			isShow: false,
			scrollTop: 0,
			opacity: 0,
			refundIndex: 0,
			closeShow: false,
			cancelRefundShow: false,
			cancelRefundData: {},
			idShowCancel: true,
			customerService: false, //是否使用客服
			sessionFrom: '',
			salesDeliveryModalShow: false,
			salesDeliveryData: {},

			pickupShow: false,
			imgSrc: '',
			downloadText: '',
			downloadPercent: '',
			downloadShow: false,
			downloadTask: null
		};
	},
	async onLoad(option) {
		uni.setNavigationBarTitle({
			title: '订单详情'
		});
		this.orderId = option.id;
		await this.$onLaunched;
		// let serviceType = parseInt(this.$api.shopSetting.app_service_type);
		// if (serviceType > 0) {
		// 	if (this.$api.store.getters.hasLogin) {
		// 		this.sessionFrom =
		// 			'{"source":"' +
		// 			'订单编号：' +
		// 			this.orderDetail.order_sn +
		// 			'","mobile":"' +
		// 			this.$api.store.state.userInfo.mobile +
		// 			'","sex":"' +
		// 			this.$api.store.state.userInfo.gender +
		// 			'","nickName":"' +
		// 			this.$api.store.state.userInfo.nickname +
		// 			'","avatarUrl":"' +
		// 			this.$api.store.state.userInfo.head_portrait +
		// 			'"}';
		// 	}
		// 	//2为小程序原生客服，3为芝麻小客服
		// 	if (serviceType === 2) {
		// 		// #ifdef MP-WEIXIN
		// 		this.customerService = true;
		// 		// #endif
		// 	}
		// 	if (serviceType === 3) {
		// 		this.customerService = true;
		// 	}
		// }
		this.getOrderDetail();
		uni.$on('refundChange', data => {
			this.refundIndex = 0;
			this.getOrderDetail();
		});
		uni.$on('evaluationStatus', data => {
			this.refundIndex = 0;
			this.getOrderDetail();
		});
	},
	onUnload() {
		uni.$off(['refundChange', 'evaluationStatus']);
	},
	computed: {
		navbarStyle() {
			let style = {};
			style.opacity = this.opacity;
			return style;
		},

		// 是否评论
		isEvaluate() {
			if (this.orderDetail.product) {
				return this.orderDetail.product.every(item => item.is_evaluate == 0);
			}
		}
	},
	filters: {
		filterShippingType(value) {
			const data = ['物流配送', '买家自提', '货到付款', '本地配送', '虚拟商品'];
			return data[parseInt(value) - 1];
		}
	},
	onPageScroll(e) {
		this.scrollTop = e.scrollTop;
	},
	methods: {
		// 订单状态
		orderStatus(val) {
			if (this.orderDetail.product) {
				return this.orderDetail.product.every(item => parseInt(item.status) == val);
			}
		},
		// 售后状态
		refundStaus(val) {
			if (this.orderDetail.product && val.length > 1) {
				return this.orderDetail.product.every(item => val.indexOf(parseInt(item.refund_status)) != -1);
			}
		},
		// 提货订单状态
		isPickupOrder(val, state) {
			if (val.product) {
				return val.product.every(item => parseInt(item.warehouse_is_pickup) == state);
			}
		},
		opacityChange(e) {
			this.opacity = e.opacity;
		},
		pageLoadingClick() {
			this.getOrderDetail();
		},
		orderStatusFilter(status) {
			let state;
			switch (parseInt(status)) {
				case 1:
					state = '待发货';
					break;
				case 2:
					state = '待收货';
					break;
				case 3:
					state = '已完成';
					break;
			}
			return state;
		},
		async getOrderDetail() {
			this.pageLoadingShow = true;
			await this.$api.http.get(this.$api.apiConfig.orderDetail + this.orderId).then(res => {
				console.log(res);
				
				this.orderDetail = res.data;
					/* this.orderDetail = res.data;
					if (this.orderDetail.product) {
						this.refundIndex = this.orderDetail.product.filter(
							item =>
								parseInt(item.refund_status) &&
								parseInt(item.refund_status) != -1 &&
								parseInt(item.refund_status) != -2 &&
								parseInt(item.refund_status) != -3 &&
								parseInt(item.refund_status) != 5
						).length;
					} */

					// this.orderDetail.product.forEach(item => {
					// 	if (parseInt(item.refund_status) != 0) {
					// 		this.refundIndex = this.refundIndex + 1;
					// 	}
					// });
					setTimeout(() => {
						this.pageLoadingShow = false;
					}, 100);
				})
				.catch(err => {
					console.log(err);
					this.pageLoadingStatus = 'error';
				});
		},
		saveImg() {
			// #ifndef H5
			//如果是在线图片，下载并保存
			if (this.$api.helper.isUrl(this.imgSrc)) {
				this.downloadPercent = 0;
				this.downloadText = this.downloadPercent + '%';
				this.downloadShow = true;
				this.downloadTask = uni.downloadFile({
					url: this.imgSrc,
					success: res => {
						if (res.statusCode === 200) {
							uni.saveImageToPhotosAlbum({
								filePath: res.tempFilePath,
								success: () => {
									this.$refs.dzToast.show({
										title: '已下载到您的手机相册',
										type: 'success'
									});
									this.downloadShow = false;
								},
								fail: () => {
									this.$refs.dzToast.show({
										title: '保存失败，请重试',
										type: 'warning'
									});
									this.downloadShow = false;
								}
							});
						}
					},
					fail: () => {
						this.$refs.dzToast.show({
							title: '下载失败，请重试',
							type: 'warning'
						});
						this.downloadShow = false;
					}
				});

				this.downloadTask.onProgressUpdate(res => {
					this.downloadPercent = res.progress;
					this.downloadText = res.progress + '%';
				});
			} else {
				const _this = this;
				uni.saveImageToPhotosAlbum({
					filePath: this.imgSrc,
					success() {
						_this.$refs.dzToast.show({
							title: '已保存到您的手机相册',
							type: 'success'
						});
					}
				});
			}
			// #endif
			// #ifdef H5
			this.$api.helper.toast('请长按松开后选择另存为保存到相册');
			// #endif
		},
		long() {
			let _this = this;
			uni.showActionSheet({
				itemList: ['保存到手机'],
				itemColor: '#0081FF',
				success: function(res) {
					if (res.tapIndex == 0) {
						_this.saveImg();
					}
				},
				fail: function(res) {
					console.log(res.errMsg);
				}
			});
		},
		downloadCancel() {
			try {
				this.downloadTask.abort();
			} catch (e) {
			} finally {
				this.downloadShow = false;
			}
		},
		// 复制
		copy(val) {
			this.$api.helper.copy(val);
			this.$refs.dzToast.show({
				title: '快递单号已复制到剪贴板',
				type: 'success'
			});
		},
		// 查看物流/拼团/砍价
		toPage(url, id) {
			this.$api.router.push({
				route: this.$api.routesConfig[url],
				query: {
					id
				}
			});
		},
		// 确定收货
		async orderTakeDelivery(item, index) {
			this.isShow = true;
		},
		// 取消收货
		takeDeliveryCancel() {
			this.isShow = false;
		},
		// 确认收货
		async takeDeliveryConfirm() {
			await this.$api.http
				.get(this.$api.apiShop.orderTakeDelivery, {
					params: {
						id: this.orderId
					}
				})
				.then(res => {
					this.isShow = false;
					uni.$emit('orderChange', {});
					this.getOrderDetail();
				});
		},
		// 删除订单
		async OrderClose() {
			await this.$api.http
				.delete(
					this.$api.apiShop.orderDelete,
					{},
					{
						params: {
							id: this.orderId
						}
					}
				)
				.then(res => {
					this.$refs.dzToast.show({
						title: '订单删除成功',
						type: 'success'
					});
					uni.$emit('orderChange', { id: this.orderId });
					setTimeout(() => {
						this.$api.router.back();
					}, 500);
				});
		},
		async getCode() {
			this.imgSrc = await this.getQrcode();
			if (!this.imgSrc)
				return this.$refs.dzToast.show({
					title: '生成二维码失败',
					type: 'warning'
				});
			this.pickupShow = true;
		},
		async getQrcode() {
			return new Promise((resolve, reject) => {
				uQRCode.make({
					canvasId: 'qrcode',
					componentInstance: this,
					text: `pickup-${this.orderDetail.pickup_code}`,
					size: 250,
					margin: 10,
					backgroundColor: '#ffffff',
					foregroundColor: '#000000',
					fileType: 'jpg',
					correctLevel: uQRCode.defaults.correctLevel,
					success: res => {
						resolve(res);
					},
					fail: res => {
						reject(res);
					}
				});
			});
		},
		// 商品详情
		toProductDetail(item) {
			if (parseInt(item.product_status) == 0)
				return this.$refs.dzToast.show({
					title: this.$api.language.user.productTheShelves,
					type: 'warning'
				});

			let url;
			if (item.marketing_type && item.marketing_type != 0) {
				if (item.marketing_type == 'group_buy') {
					url = 'groupProduct';
				} else {
					url = `${item.marketing_type}Product`;
				}
			} else {
				url = 'product';
			}
			this.$api.router.push({
				route: this.$api.routesConfig[url],
				query: {
					id: item.product_id
				}
			});
		},
		// 去评论
		toEvaluation(item) {
			this.$api.router.push({
				route: this.$api.routesConfig.evaluation,
				query: {
					data: JSON.stringify(item)
				}
			});
		},
		// 查看评论
		toEvaluationDetail(item) {
			this.$api.router.push({
				route: this.$api.routesConfig.evaluationDetail,
				query: {
					order_id: item.order_id,
					product_id: item.id
				}
			});
		},
		// 售后服务(未完成订单)
		toRefund(item) {
			this.$api.router.push({
				route: this.$api.routesConfig.refundIndex,
				query: {
					id: item.id,
					order_id: item.order_id
				}
			});
		},
		orderRefund(item) {
			const params = {
				id: item.id,
				warehouse_is_pickup: item.warehouse_is_pickup ? item.warehouse_is_pickup : null,
				num: item.num,
				order_id: item.order_id,
				product_money: item.product_money
			};
			// #ifdef MP
			if (this.$api.store.state.wechatMpLogin && this.$api.shopSetting.notify_miniprogram_sub && this.$api.shopSetting.notify_miniprogram_sub.order_refund_audit) {
				const _this = this;
				wx.requestSubscribeMessage({
					tmplIds: [
						this.$api.shopSetting.notify_miniprogram_sub.order_refund_audit //   退款审核结果通知
					],
					success: res => {
						_this.$api.router.push({
							route: this.$api.routesConfig.refundOrder,
							query: {
								data: JSON.stringify(params),
								shipping_money: _this.orderDetail.shipping_money
							}
						});
						return;
					},
					fail(err) {
						_this.$api.router.push({
							route: this.$api.routesConfig.refundOrder,
							query: {
								data: JSON.stringify(params),
								shipping_money: _this.orderDetail.shipping_money
							}
						});
						console.log(err, 2);
						return;
					}
				});
			} else {
				this.$api.router.push({
					route: this.$api.routesConfig.refundOrder,
					query: {
						data: JSON.stringify(params),
						shipping_money: this.orderDetail.shipping_money
					}
				});
			}
			// #endif
			// #ifndef MP
			this.$api.router.push({
				route: this.$api.routesConfig.refundOrder,
				query: {
					data: JSON.stringify(params),
					shipping_money: this.orderDetail.shipping_money
				}
			});
			// #endif
		},
		// 再次去购买
		puy(item) {
			let data = {};
			data.type = 'buy_again';
			data.buy_again_id = item.id;
			data.data = 'buy_again';
			this.$api.router.push({
				route: this.$api.routesConfig.orderCreate,
				query: {
					data: JSON.stringify(data)
				}
			});
		},
		// 退款详情
		refundDetail(url, item) {
			const params = {
				id: item.id,
				order_id: item.order_id,
				status: item.status
			};
			this.$api.router.push({
				route: this.$api.routesConfig[url],
				query: {
					...params,
					shipping_money: this.orderDetail.shipping_money
				}
			});
		},
		// 取消退款
		cancelRefund(status, id) {
			this.cancelRefundData = { status, id };
			this.cancelRefundShow = true;
		},
		cancelRefundCancel() {
			this.cancelRefundShow = false;
		},
		async cancelRefundConfirm() {
			this.idShowCancel = false;
			let api = this.$api.apiShop.closeOrderRefundApply;
			if (parseInt(this.cancelRefundData.status) == 4) {
				api = this.$api.apiShop.orderCustomerRefundClose;
			}
			await this.$api.http
				.post(api, {
					id: this.cancelRefundData.id
				})
				.then(res => {
					this.getOrderDetail();
					this.cancelRefundShow = false;
					uni.$emit('orderChange', {});
				})
				.catch(err => {
					console.log(err);
					this.cancelRefundShow = false;
				});
		},
		// 取消订单
		orderClose() {
			this.closeShow = true;
		},
		// 取消订单
		orderCloseCancel() {
			this.closeShow = false;
		},
		// 取消订单确认
		async orderCloseConfirm() {
			await this.$api.http
				.get(this.$api.apiShop.orderClose, {
					params: {
						id: this.orderId
					}
				})
				.then(() => {
					this.getOrderDetail();
					this.closeShow = false;
					uni.$emit('orderChange', {});
				});
		},
		// 去支付
		pay() {
			this.$api.router.push({
				route: this.$api.routesConfig.pay,
				query: {
					id: this.orderId
				}
			});
		},
		// 超时
		timeout(index) {
			this.$set(this.orderDetail, 'close_left_time', -1);
			this.$set(this.orderDetail, 'status', -4);
		},
		backClick() {
			this.$api.router.back();
		},
		serviceTap() {
			let serviceType = parseInt(this.$api.shopSetting.app_service_type);
			if (serviceType === 2) {
				//微信原生小程序客服
				// #ifndef MP-WEIXIN
				this.$refs.dzToast.show({
					title: '请在小程序中打开客服',
					type: 'warning'
				});
				// #endif
			} else if (serviceType === 3) {
				//芝麻小客服
				// #ifndef MP-WEIXIN
				let customerServiceUrl = this.$api.shopSetting.app_service_zmxkf_url;
				if (!customerServiceUrl) {
					this.$refs.dzToast.show({
						title: '客服暂未配置',
						type: 'warning'
					});
					return;
				}
				if (this.$api.store.getters.hasLogin) {
					let params = {
						source: encodeURIComponent('订单编号：' + this.orderDetail.order_sn),
						openid: this.$api.store.state.userInfo.id,
						mobile: this.$api.store.state.userInfo.mobile,
						sex: this.$api.store.state.userInfo.gender,
						nickName: encodeURIComponent(this.$api.store.state.userInfo.nickname),
						avatarUrl: encodeURIComponent(this.$api.store.state.userInfo.head_portrait)
					};

					customerServiceUrl = this.$api.helper.objParseUrlAndParam(customerServiceUrl, params);

					this.$api.shop.clearCustomerServiceRead();

					this.$api.router.push({
						route: this.$api.routesConfig.webview,
						query: {
							url: this.$api.helper.strEncode(customerServiceUrl)
						}
					});
				} else {
					//要求先登录
					this.$api.router.push({
						route: this.$api.routesConfig.login
					});
				}
				// #endif
			}
		},
		salesDelivery(id) {
			this.salesDeliveryData = { id: id };
			this.salesDeliveryModalShow = true;
		},
		salesDeliveryCancel() {
			this.salesDeliveryModalShow = false;
		},
		salesDeliveryConfirm() {
			this.salesDeliverySubmit();
		},
		async salesDeliverySubmit() {
			await this.$api.http
				.post(this.$api.apiShop.orderProductSalesDelivery, {
					id: this.salesDeliveryData.id
				})
				.then(res => {
					this.salesDeliveryModalShow = false;
					this.$refs.dzToast.show({
						title: '提交成功',
						type: 'success'
					});
					this.getOrderDetail();
				});
		},
		customerRefundTime() {
			if (!this.orderDetail.after_sale_date || this.orderDetail.after_sale_date == '') {
				return true;
			}
			return (Date.now() / 1000).toFixed(0) < parseInt(this.orderDetail.after_sale_date) + parseInt(this.orderDetail.finish_time);
		}
	}
};
</script>

<style lang="scss">
.content {
	padding-bottom: 115rpx;
}
.status {
	width: 100%;
	height: 220rpx;
}
.status-box {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 50rpx 20rpx 20rpx;
	.left {
		.icon-size {
			font-size: 72rpx;
		}
		display: flex;
		align-items: center;
		.tip {
			margin-left: 20rpx;
			.pay {
				font-size: 36rpx;
				font-weight: bold;
			}
			.msg {
				font-size: 24rpx;
			}
		}
	}
}
.order-detail {
	padding: 0 20rpx;
}
.address {
	display: flex;
	align-items: center;
	position: relative;
	overflow: hidden;
	padding: 20rpx;
	margin-top: -50rpx;
	background-color: #fff;
	border-radius: 20rpx;
	.dzicon-round_location_fill {
		font-size: 72rpx;
		margin-right: 20rpx;
	}
	.title {
		font-size: 32rpx;
		color: $dz-main-color;
		line-height: 54rpx;
	}
	.address-tip {
		margin: 6rpx 0;
		font-size: 28rpx;
		color: $dz-tips-color;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		overflow: hidden;
	}

	.icon {
		display: flex;
		align-items: center;
		justify-content: center;
		position: absolute;
		top: 0;
		right: 0;
		height: 35rpx;
		width: 70rpx;
		font-size: 24rpx;
		color: #ffffff;
		background-color: $dz-type-warning;
		border-radius: 0 0 0 15rpx;
	}
}
.product {
	margin: 20rpx 0;
	padding: 20rpx;
	border-radius: 20rpx;
	background-color: #ffffff;
	.logistics {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 30rpx;
		.logistics-l {
			flex: 1;
			display: flex;

			align-items: center;
			.logistics-tetle {
				font-size: 28rpx;
				color: $dz-content-color;
				margin-right: 20rpx;
			}
			.courier {
				width: 500rpx;
				font-size: 28rpx;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
				margin-right: 10rpx;
				color: #dea32c;
			}
		}
		.dzicon-right {
			flex-shrink: 0;
		}
	}
	.cell-item {
		display: flex;
		justify-content: space-between;
		margin-bottom: 20rpx;
		.order {
			flex: 1;
			display: flex;
			align-items: center;
			.order-tetle {
				font-size: 28rpx;
				color: $dz-content-color;
				margin-right: 20rpx;
			}
			.order-num {
				width: 400rpx;
				font-size: 28rpx;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
				color: $dz-tips-color;
			}
		}
		.order-btn {
			flex-shrink: 0;
		}
	}
	.order-item {
		display: flex;
		justify-content: space-between;
		margin-bottom: 20rpx;
		.left {
			display: flex;
			.image {
				flex-shrink: 0;
				width: 120rpx;
				height: 120rpx;
				border-radius: 10rpx;
				background-color: $dz-bg-color;
			}
			.title {
				margin-left: 20rpx;
				.name {
					line-height: 40rpx;
					color: $dz-main-color;
					font-size: 28rpx;
					display: -webkit-box;
					-webkit-box-orient: vertical;
					-webkit-line-clamp: 2;
					overflow: hidden;
				}
				.sku {
					margin-top: 10rpx;
					font-size: 24rpx;
					color: $dz-content-color;
				}
			}
		}

		.right {
			.price-box {
				margin-left: 10rpx;
				text-align: right;
				font-size: 24rpx;
				color: $dz-tips-color;
			}
		}
	}
	.btn {
		width: 100%;
		display: flex;
		justify-content: flex-end;
		flex-wrap: wrap;
		margin-bottom: 40rpx;
	}
	.btn:last-child {
		margin-bottom: 0;
	}
}
.cell-box {
	margin-bottom: 20rpx;
	background-color: #ffffff;
	border-radius: 20rpx;
}
.footer {
	position: fixed;
	bottom: 0;
	z-index: 2;
	width: 100%;
	background-color: #fff;
	box-shadow: 0 -1px 5px rgba(0, 0, 0, 0.1);
	.footer-bottom {
		width: 100%;
		height: 110rpx;
		padding: 0 20rpx;
		display: flex;
		justify-content: flex-end;
		align-items: center;
		margin-bottom: env(safe-area-inset-bottom);
	}
	.text {
		font-size: 28rpx;
		color: $dz-content-color;
	}
	.payMoney {
		display: flex;
		font-size: 32rpx;
		.price {
			margin: 0 20rpx;
			font-size: 34rpx;
			font-weight: bold;
		}
	}
	.footer-btn {
		display: flex;
		justify-content: flex-end;
	}
}
.popup-box {
	text-align: center;
	image {
		border: none;
		border-radius: 0;
		width: 300rpx;
		height: 300rpx;
		margin-top: 90rpx;
	}

	.tip {
		padding-bottom: 90rpx;
		color: #909993;
	}
}
.hideCanvas {
	position: fixed;
	top: -999px;
	left: -999px;
	z-index: -99;
}

.track {
	margin: 0 24rpx;
	background-color: #fff;
	border-radius: 20rpx;
	height: auto;
	padding: 30rpx 30rpx 30rpx 60rpx;
}

.dz-node {
	width: 68rpx;
	height: 68rpx;
	border-radius: 100rpx;
	display: flex;
	justify-content: center;
	align-items: center;
	background: #d0d0d0;
}

.dz-order-title {
	color: $dz-main-color;
	font-weight: bold;
	font-size: 32rpx;
}

.dz-order-desc {
	margin-left: 20rpx;
	color: rgb(150, 150, 150);
	font-size: 28rpx;
	margin-bottom: 6rpx;
}

.dz-order-time {
	color: rgb(200, 200, 200);
	font-size: 26rpx;
}
</style>
