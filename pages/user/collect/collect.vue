<template>
	<view>
		<dz-navbar :title="language.profile.myCollection"></dz-navbar>
		<view class="content" v-if="collectList.length > 0">
			<view class="item" v-for="(item, index) in collectList" :key="index" @tap="toGamePage(item)">
				<view class="img">
					<view class="image"><dz-image :src="$api.helper.formatImg(item.thumbnail)" borderRadius="10" width="160" height="160"></dz-image></view>
				</view>
				<view class="right">
					<view class="name">
						<view class="title">
							{{ item.dollName }}
						</view>
					</view>
					<view class="price-box" :style="{ color: theme.dzBaseColor }">
						<view class="price">{{ item.coin }}币</view>
					</view>
				</view>
			</view>
		</view>
		<dz-empty v-if="loadingStatus == 'noData'" :text="language.user.noCollection" margin-top="80" :src="empty"></dz-empty>
		<dz-loadmore v-if="loadingStatus != 'noData'" :status="loadingStatus" margin-top="20" margin-bottom="20"></dz-loadmore>
		<dz-toast ref="dzToast"></dz-toast>
	</view>
</template>

<script>
import { mapState } from 'vuex';
export default {
	data() {
		return {
			language: this.$api.language,
			theme: this.$api.theme,
			empty: this.$api.assetsConfig.empty,
			loadingStatus: 'loading',
			page: 1,
			collectList: []
		};
	},
	async onLoad() {
		uni.setNavigationBarTitle({
			title: this.$api.language.profile.myCollection
		});
		await this.$onLaunched;
		this.getCollectList();
	},
	computed: {
		...mapState(['userInfo'])
	},
	methods: {
		getCollectList() {
			this.loadingStatus = 'loading';
			this.$api.http
				.get(this.$api.apiConfig.getCollectList, {
                    page: this.page,
				})
				.then(res => {
                    // console.log(res);
					this.loadingStatus = res.data.length == 10 ? 'loadmore' : 'nomore';
					this.collectList = [...this.collectList, ...res.data];
					if (this.page == 1 && res.data.length == 0) {
						this.loadingStatus = 'noData';
					}
				})
				.catch(err => {
					console.log(err);
				});
		},
		toGamePage(item) {
			// console.log(JSON.stringify(item));
			let data = {machineId:item.machineId, video:item.video}
			uni.$api.store.commit('setLastEnterMachine', data);//为了兼容nvue与nvue之间传递的数据
			uni.$api.router.push({
				route:uni.$api.pagesConfig.game,
				query:{
					machine:encodeURIComponent(JSON.stringify(data))
				}
			});
		}
	},
	onReachBottom() {
		if (this.loadingStatus == 'nomore') return;
		this.page++;
		this.getCollectList();
	}
};
</script>

<style lang="scss" scoped>
.item {
	display: flex;
	padding: 20rpx;
	background-color: #ffffff;
	border-bottom: 1rpx solid $dz-border-color;
	.img {
		flex-shrink: 0;
		width: 180rpx;
		height: 180rpx;
		border-radius: 10rpx;
		position: relative;
		overflow: hidden;
		.image {
			width: 180rpx;
			height: 180rpx;
			background-color: $dz-bg-color;
            padding: 10rpx;
		}
		.status {
			position: absolute;
			width: 100%;
			padding: 10rpx 0;
			text-align: center;
			background-color: rgba(0, 0, 0, 0.6);
			bottom: 0;
			z-index: 2;
			font-size: 28rpx;
			color: #fff;
		}
	}
	.right {
		flex: 1;
		display: flex;
		flex-direction: column;
		justify-content: center;
		margin-left: 30rpx;
		.name {
			.title {
				width: 510rpx;
				display: -webkit-box;
				-webkit-box-orient: vertical;
				-webkit-line-clamp: 2;
				overflow: hidden;
				font-size: 28rpx;
				color: $dz-main-color;
                // margin-top: 15rpx;
			}
			.tip {
				width: 510rpx;
				padding: 10rpx 0;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
				font-size: 24rpx;
				color: $dz-tips-color;
			}
		}
		.price-box {
			display: flex;
			align-items: center;
			.icon {
				font-size: 24rpx;
			}
			.price {
				font-size: 32rpx;
                // margin-bottom: 15rpx;
			}
		}
	}
}
.item:last-child {
	border-bottom: 0px;
}
</style>
