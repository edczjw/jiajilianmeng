<template>
	<view class="bg-white">
		<!-- <dz-navbar :isBack="false" :title="barTitle" :titleBold="true" :titleSize="36" :borderBottom="false"></dz-navbar> -->
		<dz-navbar title='大神榜' :border-bottom="false"></dz-navbar>
		<wwj-scroll-body @init="mescrollInit" @down="downCallback">
		<!-- <wwj-scroll-body @down="downCallback"> -->
			<dz-gap :height="100"></dz-gap>
			<view class="">
				<u-grid :border="false" :col="3" align="right"> 
					<u-grid-item>
						<view class="flex flex-column j-end a-center number2 rounded-15 position-relative" style="width: 180rpx;height: 180rpx;margin-top: 40rpx;">
							<image class="position-absolute" :src="utils.formatImg(secondData.userIcon)" style="width: 140rpx;left:20rpx;bottom: 100rpx;border-radius: 140rpx;" mode="widthFix"></image>
							<text class="font-smd">{{secondData ? secondData.userNick : ''}}</text>
							<view class="mb-1">
								<text class="font-weight font-md">{{secondData ? secondData.successCount : 0}}</text>
							</view>
						</view>
					</u-grid-item>
					<u-grid-item>
						<view class="flex flex-column j-end a-center number1 rounded-15 position-relative" style="width: 200rpx;height: 220rpx;">
							<image class="position-absolute" :src="utils.formatImg(firstData.userIcon)" style="width: 180rpx;left: 10rpx;bottom: 110rpx;border-radius: 180rpx;" mode="widthFix"></image>
							<text class="font-smd">{{firstData ? firstData.userNick : ''}}</text>
							<view class="mb-1">
								<text class="font-weight font-md">{{firstData ? firstData.successCount : 0}}</text>
							</view>
						</view>
					</u-grid-item>
					<u-grid-item>
						<view class="flex flex-column number3 j-end a-center rounded-15 position-relative" style="width: 180rpx;height: 180rpx;margin-top: 40rpx;">
							<image class="position-absolute" :src="utils.formatImg(thirdData.userIcon)" style="width: 140rpx;left: 20rpx;bottom: 100rpx;border-radius: 140rpx;" mode="widthFix"></image>
							<text class="font-smd">{{thirdData ? thirdData.userNick : ''}}</text>
							<view class="mb-1">
								<text class="font-weight font-md">{{thirdData ? thirdData.successCount : 0}}</text>
							</view>
						</view>
					</u-grid-item>
				</u-grid>
			</view>
			<dz-gap :height="40"></dz-gap>
			<dz-line></dz-line>
			<dz-gap :height="20"></dz-gap>
			<view class="flex j-sb pb-2">
				<view class="ml-4 flex a-center j-center">
					<text class="font-md text-light-muted">我的排名:</text>
					<text class="font-md font-weight">{{getMyRank}}</text>
				</view>
				<!-- <view class="mr-4 flex a-center j-center">
					<image src="/static/icon/rewarddes.png" style="width: 90rpx;" mode="widthFix" @tap="() => showRewarddes = true"></image>
				</view> -->
			</view>
			<dz-gap :height="20" bg-color="#f8fafc"></dz-gap>
			
			<view class="bg-white flex align-stretch" hover-class="bg-light" 
				v-for="(item, index) in rankList" :key="index">
					<view class="flex a-center j-center py-2 pl-3 pr-5">
						<text class="font-lg font-weight">{{index+1}}</text>
					</view>
					<view class="flex-1 flex j-sb pr-3 py-2 border-bottom">
						<view class="flex j-center a-center">
							<image style="width: 90rpx;" :src="utils.formatImg(item.userIcon)" mode="widthFix"></image>
							<text class="ml-3 font-md text-dark">{{item.userNick}}</text>
						</view>
						<view class="flex j-center a-center">
							<!-- 右箭头 -->
							<text class="iconfont font-weight font-lg">{{item.successCount}}</text>
						</view>
					</view>
			</view>
			<u-gap :height="180"></u-gap>
		</wwj-scroll-body>
		
		<u-modal
			content="...."
			title="奖励说明"
			:show="showRewarddes"
			:zoom="false"
			@confirm="() => showRewarddes = false"
		></u-modal>
	</view>
</template>

<script>
	import MescrollMixin from "@/core/components/mescroll-uni/mescroll-mixins.js";
	// 获取系统状态栏的高度
	let systemInfo = uni.getSystemInfoSync();
	import {mapState,mapGetters} from 'vuex';
	export default {
		mixins: [MescrollMixin], // 使用mixin
		data(){
			return{
				barTitle:"大神榜",
				theme:this.$api.theme,
				navbarHeight:0,
				utils:uni.$api.helper,
				rankList: [],
				firstData: '',
				secondData: '',
				thirdData: '',
				myRank: 0,
				myCount: 0,
				showRewarddes: false
			}
		},
		computed: {
			...mapState(['userInfo']),
			
			getMyRank(){
				let str = "未上榜";
				if (this.myRank > 0) {
					str = "第" + this.myRank + "名"
				}
				return str + "(" + this.myCount + "个)"
			}
		},
		async onLoad(){
			this.navbarHeight = systemInfo.statusBarHeight;
		},
		onShow() {
			// this.getRankList("refresh", 1);
		},
		methods:{
			//进入页面调一次
			async downCallback(){
				this.getRankList("refresh", 1);
			},
			async getRankList(type='add', page){
				this.$api.http.get(this.$api.apiConfig.rankList, {
					page: page
				}).then(res=>{
					res.data.forEach((item, index)=>{
						if(index === 0){
							this.firstData = item;
						}else if(index === 1){
							this.secondData = item;
						}else if(index === 2){
							this.thirdData = item;
						}
						
						if(this.userInfo && this.userInfo.id === item.userId){
							this.myRank = index + 1;
							this.myCount = item.successCount;
						}
					})
					this.rankList = res.data;
					this.mescroll.endSuccess(0);
					this.mescroll.resetUpScroll();
				}).catch(err=>{
					console.error(err);
					this.mescroll.endSuccess(0);
				});
			}
		}
	}
</script>

<style scoped>
	.number1{
		background-color: #fffdd5;
	}
	.number2{
		background-color: #ffeeee;
	}
	.number3{
		background-color: #fff6ed;
	}
</style>
