<template>
	<view>
		<!-- #ifndef MP-TOUTIAO -->
		<dz-navbar title="我的推广" :borderBottom="false"></dz-navbar>
		<!-- #endif -->
		<wwj-scroll-body class="goodlist" @init="mescrollInit" @down="downCallback" @up="upCallback">
			<view v-if="agentList.length > 0" class="card-box" :style="{ marginTop: tabList.length == 3 && current == 0 ? '80rpx' : '184rpx' }">
				<view class="card-item" v-for="(item, index) in agentList" :key="index">
					<view class="img"><dz-image width="120rpx" height="120rpx" border-radius="60rpx" :src="helper.formatImg(item.icon) || missingFace"></dz-image></view>
					<view class="right">
						<view class="cell">
							<text>ID:</text>
							{{ item.id || '无' }}
						</view>
						<view class="name">
							昵称:
							<text>{{ item.nick }}</text>
						</view>
						<!-- <view class="cell">
							<text>电话:</text>
							{{ item.phone || '无' }}
						</view> -->
						<view class="cell">
							<text>注册时间:</text>
							{{ item.createTime | timeFormat('yyyy-mm-dd') }}
						</view>
					</view>
				</view>
			</view>
			<dz-empty
				v-show="loadingStatus == 'noData'"
				margin-top="180"
				text="没有推广数据,快去推广吧"
				:src="emptyUser"
			></dz-empty>
			<dz-loadmore
				v-show="loadingStatus != 'noData'"
				:status="loadingStatus"
				:margin-top="agentList.length == 0 ? '90' : '20'"
				margin-bottom="20"
			></dz-loadmore>
		</wwj-scroll-body>
	</view>
</template>

<script>
import MescrollMixin from "@/core/components/mescroll-uni/mescroll-mixins.js";
export default {
	mixins: [MescrollMixin], // 使用mixin
	data() {
		return {
			helper: this.$api.helper,
			theme: this.$api.theme,
			language: this.$api.language,
			type: '',
			current: 0,
			agentList: [],
			missingFace: this.$api.assetsConfig.missingFace,
			emptyUser: this.$api.assetsConfig.emptyUser,
			loadingStatus: 'loading',
		};
	},
	async onLoad(option) {
		uni.setNavigationBarTitle({
			title: '我的推广'
		});
		await this.$onLaunched;
		this.getAgentList()
	},
	filters: {
		mobileMask(val) {
			let reg = /^(\d{3})\d{4}(\d{4})$/;
			return val.replace(reg, '$1****$2');
		}
	},
	// onPullDownRefresh() {
	// 	this.page = 1;
	// 	this.agentList.length = 0;
	// 	this.teamCount = 0;
	// 	this.inData(this.current);
	// },
	// onReachBottom() {
	// 	if (this.loadingStatus == 'nomore') return;
	// 	this.page++;
	// 	this.getDistributionMemberChild();
	// },
	methods: {
		getAgentList(page=1) {
			let pageSize = 10;
			this.loadingStatus = 'loading';
			// this.agentList.length = 0;
			// this.isLoading = true;
			this.$api.http.get(this.$api.apiConfig.extendUserList, 
			{
				page: page,
				pageSize: pageSize
			})
			.then(res => {
				console.log("res: " + JSON.stringify(res));
				if (page == 1) this.agentList = [];
				this.agentList = this.agentList.concat(res.data);
				this.loadingStatus = res.data.length == pageSize ? 'loadmore' : 'nomore';
				if (page == 1 && res.data.length == 0) {
					this.loadingStatus = 'noData';
				}
				this.mescroll.endSuccess(res.data.length);
			})
			.catch(error => {
				console.error(error);
				this.mescroll.endErr();
			});
			// uni.stopPullDownRefresh();
		},
		downCallback() {
			// console.log("===========================downCallback");
			this.mescroll.resetUpScroll();
		},
		upCallback(page) {
			// console.log("=================page.num=" + page.num);
			// console.log("===============================upCallback");
			this.getAgentList(page.num);
		},
	}
};
</script>

<style lang="scss" scoped>
.search-box {
	display: flex;
	align-items: center;
	padding: 20rpx 15rpx 20rpx 20rpx;
	background: #fff;
	.dz-top-item {
		height: 28rpx;
		line-height: 28rpx;
		flex-shrink: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-right: 20rpx;
		.iconfont {
			font-size: 36rpx;
			font-weight: 500;
		}
	}
	.dz-dropdownlist {
		width: 100%;
		position: absolute;
		background: #fff;
		border-bottom-left-radius: 24rpx;
		border-bottom-right-radius: 24rpx;
		overflow: hidden;
		box-sizing: border-box;
		padding-top: 10rpx;
		padding-bottom: 26rpx;
		left: 0;
		top: 168rpx;
		visibility: hidden;
		transition: all 0.2s ease-in-out;
		z-index: 99;
		.iconcheck {
			font-size: 32rpx;
			line-height: 88rpx;
		}
	}
	.dz-dropdownlist-show {
		visibility: visible;
	}
	.dz-dropdownlist-mask {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.6);
		z-index: -1;
		transition: all 0.2s ease-in-out;
		opacity: 0;
		visibility: hidden;
	}
	.dz-mask-show {
		opacity: 1;
		visibility: visible;
	}
	.dz-dropdownlist-item {
		color: $dz-main-color;
		height: 70rpx;
		font-size: 28rpx;
		padding: 0 40rpx;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	.search {
		flex: 1;
	}
}
.team-count {
	display: flex;
	align-items: center;
	padding: 20rpx;
	background: #fff;
	border-radius: 20rpx;
	.icon {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 80rpx;
		height: 80rpx;
		margin-right: 20rpx;
		border-radius: 15rpx;
	}
}

.card-box {
	margin-top: 184rpx;
	padding: 20rpx;
	.card-item {
		display: flex;
		border-radius: 20rpx;
		padding: 20rpx;
		margin-bottom: 20rpx;
		background: #fff;
		color: #333;
		.img {
			flex-shrink: 0;
			width: 120rpx;
			height: 120rpx;
			border-radius: 60rpx;
			margin-right: 20rpx;
		}
		.name {
			color: #999;
			text {
				margin-left: 6rpx;
				font-size: 32rpx;
				color: #333;
			}
		}
		.cell {
			line-height: 46rpx;
			text {
				margin-right: 6rpx;
				color: #999;
			}
		}
		.time {
			color: #999;
		}
	}
	.card-item:last-child {
		margin-bottom: 0;
	}
}
</style>
