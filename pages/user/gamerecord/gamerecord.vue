<template>
	<view>
		<dz-navbar title='游戏记录' :border-bottom="false"></dz-navbar>
		<wwj-scroll-body @init="mescrollInit" @down="downCallback" @up="upCallback">
			<view class="bg-white">
				
				<view class="flex flex-row j-sb px-5 py-2 border-bottom" v-for="(item, index) in gameRecordList" :key="index" @tap="toComplaintPage(item)">
					<view class="flex flex-row j-center a-center">
						<view class="" style="width: 150rpx;line-height: 26rpx;">
							<text style="color: gray;font-size: 24rpx;">{{item.createTime}}</text>
						</view>
						<u--image :src="utils.formatImg(item.thumbnail)" width="110rpx" height="110rpx" radius="20rpx"></u--image>
						<view class="flex flex-column ml-2">
							<view class="">
								<text class="" style="font-size: 28rpx;">{{item.dollName}}</text>
							</view>
							<view class="">
								<text v-if="item.complaintStatus == 1" class="font-smd" style="color: gray;">申诉中</text>
								<view v-else-if="item.complaintStatus == 2">
									<text class="font-smd" style="color: green;">申诉成功</text>
									<text class="font-smd ml-1" style="color: gray;">{{item.complaintResultText}}</text>
								</view>
								<text v-else-if="item.complaintStatus == 3" class="font-smd" style="color: red;">申诉失败</text>
								<text v-else-if="item.status == 0" class="font-smd" style="color: red;">抓取失败</text>
								<text v-else-if="item.status == -1" class="font-smd" style="color: gray;">游戏中</text>
								<text v-else-if="item.status > 0" class="font-smd" style="color: green;">抓取成功</text>
							</view>
						</view>
					</view>
					<view class="flex flex-row j-center a-center">
						<u-icon v-if="item.status == 0 && item.complaintStatus == 0" name="arrow-right"></u-icon>
					</view>
				</view>
			</view>
			<u-loadmore v-show="gameRecordList.length > 0 || uploadstatus == 'loading'" :fontSize="28" :status="uploadstatus" loadmoreText="上拉加载更多" loadingText="加载中..." nomoreText="没有更多了" :line="true"></u-loadmore>
			<u-gap :height="50"></u-gap>
			<dz-empty text="还没有游戏记录呢~" v-if="gameRecordList.length==0 && uploadstatus != 'loading'"></dz-empty>
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
				utils:uni.$api.helper,
				gameRecordList: [],
				uploadstatus: 'loading'
			};
		},
		async onLoad(option) {
			await this.$onLaunched;
			// this.getgameRecordList();
		},
		methods: {
			//进入页面调一次
			async downCallback(){
				this.mescroll.resetUpScroll();
			},
			//进入页面调一次，下拉到底部触发
			upCallback(page){
				console.log(page);
				this.uploadstatus = 'loading';
				this.$api.http.get(this.$api.apiConfig.gameRecordList,
				{
					page:page.num,
				}).then(res=>{
					if(res.data && res.data.length > 0){
						if(page.num == 1){
							this.gameRecordList=[];
						}
						this.gameRecordList.push(...res.data);
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
			
			
			toComplaintPage(item){
				if(item.status == 0 && item.complaintStatus == 0){
					uni.navigateTo({
						url: '/pages/user/gamerecord/complaint?record=' + encodeURIComponent(JSON.stringify(item)) + '&fromRecord=true'
					})  
				}
			},
		}
	};
</script>

<style lang="scss">
	.content {
		
		
	}
</style>
