<template>
	<view>
		<!-- #ifndef MP-TOUTIAO -->
		<dz-navbar :title="'提现记录'" :borderBottom="false"></dz-navbar>
		<!-- #endif -->
		<dz-tabs
			:list="tabList"
			:current="current"
			:is-scroll="false"
			bar-height="8"
			:active-color="theme.dzBaseColor"
			@change="tabChange"
			style="position: fixed;width: 100%;z-index: 2;"
		></dz-tabs>
		<wwj-scroll-body class="goodlist" @init="mescrollInit" @down="downCallback" @up="upCallback">
			<view class="content">
				<view class="card" v-for="(item, index) in withdrawList" :key="index">
					<view class="flex dz-m-t-10">
						<view class="price">提现金额:￥{{ item.value }}</view>
					</view>
					<view class="flex dz-m-t-10 tip">
						<view class="time">申请时间: {{ item.createTime }}</view>
						<view class="status_0" v-if="item.status == 0">审核中</view>
						<view class="status_1" v-if="item.status == 2">已拒绝</view>
						<view class="status_2" v-if="item.status == 1">已通过</view>
					</view>
				</view>
			</view>
			<dz-loadmore v-if="loadingStatus != 'noData'" :status="loadingStatus" margin-top="20" margin-bottom="140"></dz-loadmore>
			<dz-empty :text="'暂无提现记录'" v-if="loadingStatus == 'noData'" marginTop="80" :src="emptyOrder"></dz-empty>
		</wwj-scroll-body>
	</view>
</template>

<script>
import MescrollMixin from "@/core/components/mescroll-uni/mescroll-mixins.js";
export default {
	mixins: [MescrollMixin], // 使用mixin
	data() {
		return {
			theme: this.$api.theme,
			emptyOrder: this.$api.assetsConfig.emptyOrder,
			tabList: [
				{
					value: '1',
					name: '已通过'
				},
				{
					value: '0',
					name: '审核中'
				},
				{
					value: '2',
					name: '已拒绝'
				}
			],
			current: 0,
			page: 1,
			status: 1,
			withdrawList: [],
			loadingStatus: 'loading'
		};
	},
	async onLoad() {
		uni.setNavigationBarTitle({
			title: '提现记录'
		});
		await this.$onLaunched;
		// this.getWithdrawList();
	},
	// onPullDownRefresh() {
	// 	this.page = 1;
	// 	this.withdrawList.length = 0;
	// 	this.getWithdrawList();
	// },
	// // 加载更多
	// onReachBottom() {
	// 	if (this.loadingStatus === 'nomore') return;
	// 	this.page++;
	// 	this.getWithdrawList();
	// },
	methods: {
		async getWithdrawList(page=1) {
			let pageSize = 10;
			this.loadingStatus = 'loading';
			await this.$api.http
				.get(this.$api.apiConfig.withdrawList, {
					page: page,
					status: this.status,
					pageSize: pageSize
				})
				.then(res => {
					console.log("res: " + JSON.stringify(res));
					if(page == 1) this.withdrawList = [];
					this.loadingStatus = res.data.length == pageSize ? 'loadmore' : 'nomore';
					this.withdrawList = [...this.withdrawList, ...res.data];
					if (page == 1 && res.data.length == 0) {
						this.loadingStatus = 'noData';
					}
					this.mescroll.endSuccess(res.data.length);
				}).catch(error=>{
					console.error(error);
					this.mescroll.endErr();
				});
			// uni.stopPullDownRefresh();
		},
		tabChange(e) {
			this.current = e;
			this.status = this.tabList[e].value;
			this.page = 1;
			// this.withdrawList.length = 0;
			// this.getWithdrawList();
			this.mescroll.resetUpScroll();
		},
		downCallback() {
			this.mescroll.resetUpScroll();
		},
		upCallback(page) {
			this.getWithdrawList(page.num);
		}
	}
};
</script>

<style lang="scss">
.content {
	margin-top: 82rpx;
}
.card {
	padding: 20rpx 30rpx;
	background: #ffffff;
	border-bottom: 1rpx solid $dz-border-color;
	.flex {
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 32rpx;
		color: $dz-main-color;
		.status_0 {
			color: #fdc561;
		}
		.status_1 {
			color: $dz-type-error;
		}
		.status_2 {
			color: $dz-type-success;
		}
	}
	.icon {
		display: flex;
		align-items: center;
		.dzicon-iconfont {
			margin-right: 10rpx;
			font-size: 40rpx;
		}
		.dzicon-alip {
			color: #00a0e9;
		}
		.dzicon-card_fill {
			color: #fdc561;
		}
		.dzicon-wechat {
			color: $dz-type-success;
		}
	}
	.price {
		flex-shrink: 0;
	}
	.tip {
		font-size: 26rpx;
		color: $dz-main-color;
	}
	.time {
		color: $dz-tips-color;
	}
}
.card:last-child {
	border-bottom: none;
}
</style>
