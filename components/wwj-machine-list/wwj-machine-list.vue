<template>
	<view class="bg-white top-radis" :style="{width:'750rpx', height:height+'rpx'}">
		<view class="d-flex flex-row a-center j-center mt-1">
			<text class="font-weight font-title-size">{{doll.name}}</text>
		</view>
		<view class="d-flex flex-row flex-wrap ddw-machine-card">
			<view v-for="(item,index) in list" class="mx-2" :key="item.id" @click="selecteMachine(item)" :data-index="item.id" hover-class="gui-tap">
				<view>
					<image :src="utils.formatImg(item.previewImg)" style="border-radius: 20rpx;width: 200rpx;height: 270rpx;" mode=""></image>
					<!-- <u--image radius="20" :width="200" :height="270" :src="utils.formatImg(item.previewImg)"></u--image> -->
				</view>
				<view class="d-flex flex-row j-sb px-1 mt-1">
					<view class="a-center j-center">
						<text class="font-sm">{{item.name}}</text>
					</view>
					<view class="j-center a-center">
						<text v-if="item.player == null" class="font-machine-info-size font-weight" style="color:green">空闲</text>
						<text v-else-if="item.player && item.subscribers.length == 0" class="font-machine-info-size font-weight" style="color:red">游戏中</text>
						<text v-else class="font-machine-info-size font-weight" style="color:red">{{item.subscribers.length}}人排队中</text>
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
				utils:uni.$api.helper,
				list:[],
				height:0,
				u:uni.$u,
			}
		},
		props: {
			title:{
				type:String,
				default:""
			},
			doll:{
				type:Object,
				default:{}
			}
		},
		created(){
			uni.$api.http.get(uni.$api.apiConfig.machineListUrl+"/" + this.doll.id).then(res=>{
				this.list = res.data.machineList || [];
				this.height = (360 * (parseInt((this.list.length - 1) / 3) + 1)) + 180;
			});
		},
		destroy(){
			this.list = [];
		},
		methods: {
			selecteMachine(item) {
				uni.$api.http.get(uni.$api.apiConfig.checkMachineStatus + "/" + item.id).then(res=>{
					this.$emit("close");
					let data = {machineId:item.id,video:item.video}
					uni.$api.store.commit('setLastEnterMachine',data);//为了兼容nvue与nvue之间传递的数据
					uni.$api.router.push({
						route:uni.$api.pagesConfig.game,
						query:{
							machine:encodeURIComponent(JSON.stringify(data))
						}
					});
				}).catch(err=>{
					console.log(err)
				});
			}
		},
	}
</script>

<style>
	.ddw-machine-card{margin-top: 20rpx;}
	.top-radis{border-top-left-radius: 30rpx;border-top-right-radius: 30rpx;}
	.font-title-size{font-size: 28rpx;}
	.font-machine-info-size{font-size:20rpx;}
</style>
