<template>
	<view>
		<!-- 佣金明细 -->
		<dz-navbar :title="type ? '收益日志' : language.distribution.theCommissionSubsidiary"></dz-navbar>
		<wwj-scroll-body class="goodlist" @init="mescrollInit" @down="downCallback" @up="upCallback">
			<view class="content">
				<view class="item" v-for="(item,index) in promoterRecordList" :key="index">
					<!-- <view class="order-num">{{ language.distribution.type }} {{ recodeType(item.group) }}</view> -->
					<view class="name">{{ `${item.userNick}${item.userId} 充值￥${item.rechargeValue}` }}</view>
					<view class="price">
						<text class="time">{{item.createTime}}</text>
						<text class="checked">佣金+{{item.commission}} </text>
					</view>
				</view>
			</view>
			<dz-empty v-if="loadingStatus == 'noData'" margin-top="80" text="暂无佣金记录" :src="emptyOrder"></dz-empty>
			<view v-if="loadingStatus != 'noData'" class="dz-ios-m-bline dz-p-b-20">
				<dz-loadmore  :status="loadingStatus" :margin-top="promoterRecordList.length>0 ? 20 : 100"></dz-loadmore>
			</view>
		</wwj-scroll-body>
	</view>
</template>

<script>
import MescrollMixin from "@/core/components/mescroll-uni/mescroll-mixins.js";
export default {
	mixins: [MescrollMixin], // 使用mixin
	data() {
		return{
			theme: this.$api.theme,
			language: this.$api.language,
			type: '',
			emptyOrder: this.$api.assetsConfig.emptyOrder,
			page:1,
			promoterRecordList: [],
			loadingStatus: 'loading'
		}
	},
	async onLoad(option) {
		uni.setNavigationBarTitle({
			title: option.type ? '收益日志' : this.$api.language.distribution.theCommissionSubsidiary
		});
		if(option.type) {
			this.type = option.type
		}
		await this.$onLaunched;
		// this.getPromoterRecordList();
	},
	// onPullDownRefresh() {
	// 	this.page = 1;
	// 	this.promoterRecordList.length = 0;
	// 	this.getPromoterRecordList();
	// },
	// onReachBottom() {
	// 	if(this.loadingStatus == 'nomore') return;
	// 	this.page++;
	// 	this.getPromoterRecordList();
	// },
	methods: {
		async getPromoterRecordList(page=1) {
			this.loadingStatus = 'loading';
			let pageSize = 10
			await this.$api.http.get(this.$api.apiConfig.commissionList ,{
				page: page,
				pageSize: pageSize
			}).then(res=> {
				// console.log("res: " + JSON.stringify(res));
				if(page == 1) this.promoterRecordList = [];
				this.loadingStatus = res.data.length == pageSize ? 'loadmore' : 'nomore';
				this.promoterRecordList = [...this.promoterRecordList, ...res.data];
				if(page == 1 && res.data.length == 0) {
					this.loadingStatus = 'noData';
				}
				this.mescroll.endSuccess(res.data.length);
			}).catch(error=>{
				console.error(error);
				this.mescroll.endErr();
			});
			// uni.stopPullDownRefresh();
		},
		downCallback() {
			this.mescroll.resetUpScroll();
		},
		upCallback(page) {
			this.getPromoterRecordList(page.num);
		}
	}
}
</script>

<style lang="scss">
.content {
	.item {
		background-color: #FFFFFF;
		padding: 20rpx 30rpx;
		border-bottom: 1rpx solid $dz-bg-color;
		.order-num {
			font-size: 28rpx;
			color: $dz-main-color;
		}
		.name {
			padding: 10rpx 0 5rpx;
			font-size: 34rpx;
			color: $dz-main-color;
		}
		.price {
			display: flex;
			justify-content: space-between;
			align-items: center;
			font-size: 32rpx;
			color:$dz-main-color;
			.time {
				font-size: 28rpx;
				color: $dz-tips-color;
			}
			.checked {
				color: $dz-type-error;
			}
		}
	}
}
</style>
