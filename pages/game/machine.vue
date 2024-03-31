<template>
	<view>
		<!-- #ifndef MP-TOUTIAO -->
		<dz-navbar title='机器列表' :border-bottom="false"></dz-navbar>
		<!-- #endif -->
		
		<u-sticky bgColor="#f3f3f3" :customNavHeight="helper.px2rpx(this.navbarHeight)">
			<view class="flex mx-5 mt-2 shadow-lg rounded-20" style="z-index: 9999;" @tap="openDollDetail">
				<view class="p-2">
					<u--image :src="helper.formatImg(doll.thumbnail)" width="180rpx" height="180rpx" radius="20rpx"></u--image>
				</view>
				<view class="flex-column p-3">
					<view class="flex-row">
						<text class="font26 text-gray">娃娃名称:</text>
						<text class="font26 ml-1">{{doll.name}}</text>
					</view>
					<view class="flex-row">
						<text class="font26 text-gray">所需金币:</text>
						<text class="font26 ml-1">{{doll.coin}}金币/次</text>
					</view>
					<view class="flex-row">
						<text class="font26 text-gray">可兑积分:</text>
						<text class="font26 ml-1">{{doll.exchangeJifen}}积分</text>
					</view>
				</view>
			</view>
		</u-sticky>
		<view class="flex mx-3 mt-1 flex-wrap" style="z-index: 0;">
			<view v-for="(item, index) in machineList" class="flex m-2 p-1 flex-column shadow-sm rounded-20" style="width: 300rpx;" @click="navToMachinePage(item)">
				<view class="flex j-center a-center rounded-20">
					<u-image :radius="20" :src="helper.formatImg(item.previewImg)"  :height="400" :width="300">
						<view slot="error" >
							<u-image src="../../static/image/errorimg.png" :width="100" height="100"></u-image>
						</view>
					</u-image>
				</view>
				<view class="flex-column">
					<view class="flex flex-row j-sb p-1">
						<view class="flex-row">
							<text class="font25 text-gray">{{item.name}}</text>
						</view>
						<view class="flex-row">
							<text class="font25" :style="{color: (item.status > 0 ? 'red' : 'green')}">{{item.status > 0 ? '忙碌' : '空闲'}}</text>
						</view>
					</view>
					
					<view class="flex a-center j-center">
						<view class="text-center p-1 rounded-20 shadow-lg font-weight" style="color: white;background-color: #fe8e2e;width: 260rpx;" @click="">进入游戏</view>
					</view> 
				</view>
			</view>
			
		</view>
	</view>
</template>
<script>
	export default {
		data() {
			return {
				helper:this.$api.helper,
				swiperCurrent: 0,
				navbarHeight:0,
				machineList: [],
				doll: {
					thumbnail : '',
					name: '',
					coin: '',
					exchangeJifen: ''
				}
			};
		},

		onLoad(option) {
			let statusBarH = uni.getSystemInfoSync().statusBarHeight;
			this.navbarHeight = statusBarH + 44;
			const doll = JSON.parse(option.doll);
			this.doll = doll;
			console.log(this.doll)
			this.loadData(doll.id);
		},
		methods: {
			/**
			 * 请求静态数据只是为了代码不那么乱
			 * 分次请求未作整合
			 */
			async loadData(dollId) {
				// uni.showLoading();
				this.$api.http.get(this.$api.apiConfig.machineListUrl + dollId).then(res => {
					this.machineList = res.data.machineList || [];
					
					console.log(this.machineList);
				}).catch(err => {
					console.log(err)
				});
			},
			//进入游戏
			navToMachinePage(item) {
				uni.$api.http.get(this.$api.apiConfig.checkMachineStatus + "/" + item.id).then(res=>{
					let data = {machineId: item.id,video:item.video}
					this.$api.store.commit('setLastEnterMachine',data);//为了兼容nvue与nvue之间传递的数据
					this.$api.router.push({
						route:this.$api.pagesConfig.game,
						query:{
							machine:encodeURIComponent(JSON.stringify(data))
						}
					});
				}).catch(err=>{
					console.log(err)
				});
			},
			openDollDetail() {
				// this.showDollDetail = true;
				uni.$u.throttle(()=>{
					uni.$api.store.commit('setLastLookDoll',this.doll);//为了兼容nvue与nvue之间传递的数据
					uni.$api.router.push({
						route:uni.$api.pagesConfig.dollDetail,
						query:{}
					});
				},800,true);
				
				// #ifdef APP-NVUE
				// uni.$emit("dollDetail");
				// #endif
			},
		}
	}
</script>
<style lang="scss">
	
</style>
