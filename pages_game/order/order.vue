<template>
	<view>
		<!-- #ifndef MP-TOUTIAO -->
		<dz-navbar :title="type == 1 ? '娃娃订单' : '兑换订单'" :borderBottom="false"></dz-navbar>
		<!-- #endif -->
		<!--滑动栏-->
		<view class="dz-tab"><dz-tabs :list="list" :current="current" :is-scroll="false" :activeColor="theme.dzBaseColor" bar-height="8" @change="tabsChange"></dz-tabs></view>
		<wwj-scroll-body @init="mescrollInit" @down="downCallback" @up="upCallback">
			<!--内容-->
			<view class="dz-content">
				<view class="dz-item" v-for="(item, index) in orderList" :key="index">
					<view class="top">
						<view class="sn" @tap.stop="copy(item.orderNo)">
							订单号:{{ item.orderNo }}
						</view>
						<view class="on-color" :style="{ color: theme.dzBaseColor }">{{ orderStatus[item.status] }}</view>
					</view>
					<view class="order-content" @tap="toOrderDetail(item)">
						<block v-for="(orderItem, orderIndex) in item.orderItemVos" :key="orderIndex">
							<view v-if="orderIndex < item.moreNum" class="order-item">
								<view class="left">
									<view class="image"><dz-image :src="helper.formatImg(orderItem.productThumbnail)" borderRadius="10" width="120" height="120"></dz-image></view>
									<view class="title">
										<view class="name">
											<dz-tag
												class="dz-m-r-10"
												:bg-color="theme.dzBaseColor"
												:border-color="theme.dzBaseColor"
												:color="theme.dzBaseFontColor"
												mode="dark"
												size="mini"
												:show="parseInt(orderItem.gift_flag) > 0 ? true : false"
												:text="language.orderCreate.giveaways"
											></dz-tag>
											{{ orderItem.productName }}
										</view>
									</view>
								</view>
							</view>
						</block>
					</view>
					<view v-if="item.orderItemVos.length > item.moreNum" class="dz-font-24 dz-color-9" @tap="moreTap(index)">
						显示剩余{{ item.orderItemVos.length - item.moreNum }}件商品
						<dz-icon class="dz-m-l-6" name="unfold"></dz-icon>
					</view>
					<view class="time">{{ item.createTime }}</view>
					<view class="bottom" :class="{ 'dz-m-t-20': item.status >= 2 }">
						<view
							v-if="(item.status == 101 && (item.close_left_time && item.close_left_time < 0))"
							class="del"
							@tap="OrderClose(item, index)"
						>
							删除订单
						</view>
						<view v-else></view>
						<view class="btn">
							<dz-button
								v-if="item.status != 1"
								type="info"
								size="mini"
								shape="circle"
								:border="false"
								hoverClass="none"
								:custom-style="{ width: '120rpx', background: '#FFF', marginLeft: '20rpx', border: '1rpx solid rgba(0, 0, 0, 0.12)' }"
								@click="toShipping(item.id, 'shipping')"
							>
								查看物流
							</dz-button>
							<dz-button
								v-if="item.status == 2"
								:custom-style="{ background: theme.dzBaseColor, color: theme.dzBaseFontColor, width: '120rpx', marginLeft: '20rpx' }"
								hover-class="none"
								:border="false"
								size="mini"
								shape="circle"
								@click="orderTakeDelivery(item, index)"
							>
								确定收货
							</dz-button>
						</view>
					</view>
				</view>
				<u-loadmore v-show="orderList.length > 0 || uploadstatus == 'loading'" :fontSize="28" :status="uploadstatus" loadmoreText="上拉加载更多" loadingText="加载中..." nomoreText="没有更多了" :line="true"></u-loadmore>
				<u-gap :height="50"></u-gap>
				<dz-empty text="暂无订单,去逛逛~" v-if="orderList.length==0 && uploadstatus != 'loading'"></dz-empty>
			</view>
		</wwj-scroll-body>
		<!-- 确定收货提醒 -->
		<dz-modal
			v-model="isShow"
			:mask-close-able="false"
			title="确认收货"
			content="请确定在收到商品后操作哦"
			:confirm-color="theme.dzBaseColor"
			:show-cancel-button="true"
			:async-close="true"
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
			:async-close="true"
			@cancel="orderCloseCancel"
			@confirm="orderCloseConfirm"
		></dz-modal>
		<dz-toast ref="dzToast"></dz-toast>
	</view>
</template>

<script>
import MescrollMixin from "@/core/components/mescroll-uni/mescroll-mixins.js";
export default {
	mixins: [MescrollMixin], // 使用mixin
	data() {
		return {
			helper: this.$api.helper,
			language: this.$api.language,
			theme: this.$api.theme,
			emptyOrder: this.$api.assetsConfig.emptyOrder,
			current: 0,
			list: [
				{
					status: 0,
					name: '全部'
				},
				{
					status: 1,
					name: '待发货'
				},
				{
					status: 2,
					name: '待收货'
				},
				{
					status: 3,
					name: '已完成'
				}
			],
			orderList: [],
			uploadstatus: 'loading',
			orderStatus: [
				"全部订单",
				"待发货",
				"已发货",
				"已完成"
			],
			tabScrollTop: -1,
			takeDelivery: {}, // 确定参数
			isShow: false,
			closeShow: false,
			type: null
		};
	},
	async onLoad(e) {
		this.type = e.type || 0;
		
		if (e.status) {
			this.current = parseInt(e.status);
		}
		
		await this.$onLaunched;
	},
	onUnload() {
		// uni.$off('orderChange');
	},

	methods: {
		//删除指定订单
		deleteOrder(id) {
			if (!id) {
				return;
			}
			let orderId = parseInt(id);
			for (let i = 0; i < this.orderList.length; i++) {
				if (orderId == parseInt(this.orderList[i].id)) {
					this.orderList.splice(i, 1);
				}
			}
		},
		//tabs滑动事件
		tabsChange(index) {
			if (this.current == index) return;
			this.current = index;
			this.orderList=[];
			this.mescroll.resetUpScroll();
		},
		
		//进入页面调一次
		async downCallback(){
			this.mescroll.resetUpScroll();
		},
		//进入页面调一次，下拉到底部触发
		upCallback(page){
			this.uploadstatus = 'loading';
			this.$api.http.get(this.$api.apiConfig.orderList,
			{
				productType: this.type,
				status: this.current,
				page: page.num
			}).then(res=>{
				if(res.data && res.data.length > 0){
					res.data.forEach(item => {
						item.moreNum = 5;
					});
					
					if(page.num == 1){
						this.orderList=[];
					}
					this.orderList.push(...res.data);
					this.uploadstatus = 'loadmore';
				}
				
				if(res.data.length < page.size){
					this.uploadstatus = "nomore";
				}
				
				this.mescroll.endSuccess(res.data.length);
			}).catch(err=>{
				console.log(err);
				this.mescroll.endErr();
			})
		},
		moreTap(index) {
			this.orderList[index].moreNum = this.orderList[index].orderItemVos.length;
		},
		// 订单详情
		toOrderDetail(item) {
			this.$api.router.push({
				route: this.$api.pagesConfig.orderDetail,
				query: {
					id: item.id
				}
			}); 
		},
		// 删除订单
		async OrderClose(item, index) {
			await this.$api.http
				.delete(
					this.$api.apiShop.orderDelete,
					{},
					{
						params: {
							id: item.id
						}
					}
				)
				.then(res => {
					this.orderList.splice(index, 1);
					this.$refs.dzToast.show({
						title: '订单删除成功',
						type: 'success'
					});
				});
		},
		// 确定收货
		async orderTakeDelivery(item, index) {
			this.isShow = true;
			this.takeDelivery.id = item.id;
			this.takeDelivery.index = index;
		},
		// 取消收货
		takeDeliveryCancel() {
			this.isShow = false;
		},
		// 确认收货
		async takeDeliveryConfirm() {
			// await this.$api.http
			// 	.get(this.$api.apiShop.orderTakeDelivery, {
			// 		params: {
			// 			id: this.takeDelivery.id
			// 		}
			// 	})
			// 	.then(res => {
			// 		if (parseInt(this.current) == 3) {
			// 			this.orderList.splice(this.takeDelivery.index);
			// 			if (this.orderList.length == 0) {
			// 				this.loadingStatus = 'noData';
			// 			}
			// 		} else {
			// 			this.orderList[this.takeDelivery.index].orderItemVos.forEach(item => {
			// 				item.status = 3;
			// 			});
			// 			this.$set(this.orderList, this.takeDelivery.index, this.orderList[this.takeDelivery.index]);
			// 		}
			// 		this.isShow = false;
			// 		this.initOrderList();
			// 	});
		},
		// 查看物流id
		toShipping(id, url) {
			this.$api.router.push({
				route: this.$api.pagesConfig.orderDetail,
				query: {
					id: id
				}
			}); 
			
			/* this.$api.router.push({
				route: this.$api.pagesConfig[url],
				query: {
					id
				}
			}); */
		},
		// 取消订单
		orderClose(item, index) {
			this.closeShow = true;
			this.takeDelivery.id = item.id;
			this.takeDelivery.index = index;
		},
		orderCloseCancel() {
			this.closeShow = false;
		},
		async orderCloseConfirm() {
			await this.$api.http
				.get(this.$api.apiShop.orderClose, {
					params: {
						id: this.takeDelivery.id
					}
				})
				.then(() => {
					this.orderList.splice(this.takeDelivery.index, 1);
					if (this.orderList.length == 0) {
						this.loadingStatus = 'noData';
					}
					this.closeShow = false;
				});
		},
		//复制
		copy(text) {
			this.$api.helper.copy(text);
			this.$refs.dzToast.show({
				title: this.$api.language.application.copySuccess,
				type: 'success'
			});
		}
	}
};
</script>

<style lang="scss">
.dz-tab {
	position: fixed;
	width: 100%; //这里必须设置100%，否则在fixed情况下不能左右滑动
	z-index: 992;
	/* #ifdef MP-TOUTIAO */
	top: 0;
	/* #endif */
}

.dz-content {
	margin-top: 86rpx;
	padding: 20rpx;
}

.dz-item {
	padding: 20rpx;
	background-color: #fff;
	border-radius: 20rpx;
	overflow: hidden;
	margin-bottom: 20rpx;

	.top {
		display: flex;
		justify-content: space-between;
		align-items: center;
		.sn {
			display: flex;
			align-items: center;
			font-size: 28rpx;
			color: $dz-main-color;
			// font-weight: bold;
		}
	}

	.marketing {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
}

.order-content {
	margin-top: 30rpx;
	.order-item {
		display: flex;
		justify-content: space-between;
		margin-bottom: 20rpx;
		.left {
			display: flex;
			.image {
				flex-shrink: 0;
				width: 120rpx;
				height: 130rpx;
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
}

.tip {
	display: flex;
	flex-direction: row-reverse;
	align-items: center;
	width: 100;
	padding-top: 20rpx;
	font-size: 24rpx;
	color: $dz-tips-color;
	text {
		margin-left: 10rpx;
		font-size: 32rpx;
		color: $dz-main-color;
	}
}

.time {
	display: flex;
	flex-direction: row-reverse;
	align-items: center;
	width: 100;
	padding-top: 20rpx;
	font-size: 28rpx;
	color: $dz-main-color;
}

.bottom {
	display: flex;
	justify-content: space-between;

	.del {
		color: $dz-content-color;
	}
}

.color {
	color: $dz-main-color;
}

.on-color {
}
</style>
