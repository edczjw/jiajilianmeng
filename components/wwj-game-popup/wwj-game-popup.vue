<template>
	<view v-if="isShow">
		<u-overlay :show="type==1">
			<view ref="reward" class="flex a-center j-center" style="top: 400rpx;">
				<view class="flex flex-column j-sb col-8 bg-white rounded-20" style="height: 550rpx;">
					<view class="mt-3 a-center">
						<text style="font-size: 32rpx;">亲,到您抓娃娃了!</text>
					</view>
					<view class="a-center mt-3">
						<image class="rounded-lg m-1" :src="doll?util.formatImg(doll.thumbnail):''"
							style="width: 200rpx;height: 200rpx;border-radius: 20rpx;"></image>
						<text class="mt-3"  style="font-size: 26rpx;color:#c0c4cc;">倒计时结束，未点开始就算放弃</text>
					</view>
					<view class="flex flex-row j-center p-4">
						<view class="pl-4 pr-2">
							<u-button type="info" shape="circle" text="不抓了" @click="close"></u-button>
						</view>
						<view class="pl-2 pr-4">
							<u-button class="custom-style" type="error" :customStyle="{width:'200rpx'}" shape="circle" :hairline="false" :text="btnText" @click="startGame"></u-button>
						</view>
					</view>
				</view>
			</view>
		</u-overlay>
		<u-overlay :show="type==2">
			<view ref="reward" class="flex a-center j-center" style="top: 400rpx;">
				<view class="flex flex-column j-sb a-center col-8 bg-white rounded-20" style="height: 600rpx;">
					<view class="a-center">
						<image class="rounded-lg m-1" src="https://oss.fszhuazhuale.com/oss/game/jiayou.png"
							style="width: 300rpx;height: 100rpx;"></image>
					</view>
					<view class="a-center">
						<image class="rounded-lg m-1" :src="doll?util.formatImg(doll.thumbnail):''"
							style="width: 200rpx;height: 200rpx;border-radius: 20rpx;"></image>
						<text class="mt-5" style="font-size: 26rpx; color:#c0c4cc;">没有抓中哦</text>
					</view>
					<view class="flex flex-row j-center p-5">
						<view class="pl-4 pr-2">
							<u-button type="info" shape="circle" text="下次再来" @click="close"></u-button>
						</view>
						<view class="pl-2 pr-4">
							<u-button class="custom-style" type="error" :customStyle="{width:'200rpx'}" shape="circle" :hairline="false" :text="btnText" @click="startGame"></u-button>
						</view>
					</view>
				</view>
			</view>
		</u-overlay>
		<u-overlay :show="type==3">
			<view ref="reward" class="flex flex-column j-center a-center position-relative py-5" style="top: 350rpx;">
				<view class="a-center">
					<image src="https://oss.fszhuazhuale.com/oss/game/reward.png"
						style="width: 500rpx;height: 500rpx;"></image>
				</view>
				<view class="a-center position-absolute j-center" style="top: 160rpx;">
					<image class="rounded-lg m-1" :src="doll?util.formatImg(doll.thumbnail):''"
						style="width: 150rpx;height: 150rpx;border-radius: 20rpx;"></image>
				</view>
				<view class="flex flex-row a-center j-center position-absolute" style="bottom: 0rpx;">
					<view class="mr-2">
						<u-button type="info" shape="circle" text="不了,下次吧" @click="close"></u-button>
					</view>
					<view class="ml-2">
						<u-button class="custom-style" :customStyle="{width:'200rpx'}" type="error" shape="circle" :hairline="false" :text="btnText" @click="startGame"></u-button>
					</view>
				</view>
			</view>
		</u-overlay>	
	</view>
</template>

<script>
	import {
		mapState,
		mapGetters
	} from 'vuex';
	const bindingX = uni.requireNativePlugin("bindingx");
	export default {
		name:"wwj-game-popup",
		props: {
			show:{
				type:Boolean,
				default:false
			},
			type: {
				type: Number,
				default: 1 //1为预约到你弹框，2为抓取失败，3为抓取成功
			},
			stopTime:{
				type:[String,Number],
				default:0
			},
			title:{
				type:String,
				default:""
			},
			content:{
				type:String,
				default:""
			},
			doll:{
				type:Object,
				default:null
			}
		},
		data() {
			return {
				assetsConfig: uni.$api.assetsConfig,
				util:uni.$api.helper,
				countdownTime:0,
				isShow:false,
			}
		},
		computed: {
			...mapState(['userInfo','offsetTime','serverConf']),
			btnText(){
				if(this.type == 1){
					return "开始游戏(" + this.countdownTime +"s)";
				}else{
					return "再来一局(" + this.countdownTime + "s)";
				}
			}
		},
		mounted(){
			if(this.stopTime > 0){
				this.setInterval(this.stopTime);
			}
		},
		deactivated(){
			this.clearInterval();
		},
		destroy(){
			this.clearInterval();
		},
		watch: {
			stopTime(newValue, oldValue) {
				if(newValue > 0){
					this.setInterval(newValue);
				}
			},
			show(newValue, oldValue){
				this.isShow = newValue
				if(this.isShow == true){
					this.$nextTick(()=>{
						this.rewardAnimation();
					})
				}
			}
		},
		methods: {
			clearInterval(){
				console.log("clear countdown")
				if(this.timer) {
					clearInterval(this.timer);  
					this.timer = null;  
				} 
			},
			setInterval(stopTime){
				this.clearInterval();
				this.countdownTime = Number(this.stopTime - uni.$api.helper.getLocalTimestamp() - this.offsetTime);
				this.timer = setInterval( () => {
					if(this.countdownTime > 0){
						this.countdownTime --;	
					}else {
						this.close();
					}
				}, 1000)
			},
			close(){
				this.clearInterval();
				this.isShow = false;
				this.$emit("stopGame")
			},
			startGame(){
				this.$emit("startGame");
				this.clearInterval();
				this.isShow = false;
			},
			rewardAnimation(){
				let reward = uni.$api.helper.getEl(this.$refs.reward);
				let bindingx = bindingX.bind({
					eventType:'timing',
					exitExpression: 't>800',
					props:[
						{
							element:reward,
							property:'transform.scale',
							expression: 'easeOutElastic(t,0,1,800)',
						}
					]
				},(result)=>{
					if(result.state=='exit'){
						bindingX.unbind({
							token: bindingx.token,
							eventType: 'timing'
						});
					}
				});
			}
		},
	}
</script>

<style>
</style>
