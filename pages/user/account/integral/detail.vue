<template>
	<view>
		<dz-navbar title='积分明细' :border-bottom="false"></dz-navbar>
		<dz-tabs :list="tabList" :current="current" :is-scroll="false" bar-height="8" :active-color="theme.dzBaseColor"
			@change="tabChange" style="position: fixed;width: 100%;z-index: 2;"></dz-tabs>
		<wwj-scroll-body @init="mescrollInit" @down="downCallback" @up="upCallback">
			<view class="bg-white" style="margin-top: 82rpx;">
				
				<view class="flex j-sb a-center px-5 py-2 border-bottom" v-for="(item, index) in jifenLogList" :key="index">
					<view class="flex flex-column ml-2">
						<view class="font-30">
							<text>{{item.desc}}</text>
						</view>
						<view class="font-28 text-gray">
							<text>{{ item.createTime }}</text>
						</view>
					</view>
					<view class="mr-2 font-30">
						<text :style="{ color: item.type > 0 ? 'green' : 'red' }">{{ (item.type > 0 ? '+':'-') + item.jifen }}积分</text>
					</view>
				</view>
			</view>
			<u-loadmore v-show="jifenLogList.length > 0 || uploadstatus == 'loading'" :fontSize="28" :status="uploadstatus" loadmoreText="上拉加载更多" loadingText="加载中..." nomoreText="没有更多了" :line="true"></u-loadmore>
			<u-gap :height="50"></u-gap>
			<dz-empty text="暂无积分记录~" v-if="jifenLogList.length==0 && uploadstatus != 'loading'"></dz-empty>
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
				tabList: [{
						state: 0,
						name: '全部'
					},
					{
						state: 1,
						name: '收入'
					},
					{
						state: 2,
						name: '消费'
					}
				],
				current: 0,
				jifenLogList: [],
				uploadstatus: 'loading'
			};
		},
		async onLoad(option) {
			await this.$onLaunched;
		},
		methods: {
			tabChange(e) {
				if (this.current == e) {
					return;
				}
				this.current = e;
				this.jifenLogList=[];
				this.mescroll.resetUpScroll();
			},
			
			//进入页面调一次
			async downCallback(){
				this.mescroll.resetUpScroll();
			},
			//进入页面调一次，下拉到底部触发
			upCallback(page){
				this.uploadstatus = 'loading';
				this.$api.http.get(this.$api.apiConfig.integralRecord,
				{
					page: page.num,
					type: this.tabList[this.current].state
				}).then(res=>{
					if(res.data && res.data.length > 0){
						
						if(page.num == 1){
							this.jifenLogList=[];
						}
						this.jifenLogList.push(...res.data);
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
		}
	};
</script>

<style lang="scss">
	
</style>
