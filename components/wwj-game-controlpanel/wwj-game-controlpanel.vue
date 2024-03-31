<template>
	<view class="flex flex-row j-sb" :style="{opacity : (status == 2 ? 0.4 : 1),height: panelHeight + 'px'}">
		<view class="flex-1 position-relative">
			<view class="direction-btn position-absolute a-center j-center rounded-circle" style="left: 30rpx;top: 105rpx;" @touchstart="opera(223)" @touchend="leftMoveEnd(255)" hover-stay-time="50" hover-class="btn-hover">
				<image :src="assetsConfig.gameLeftImage" class="direction-btn-image"></image>
			</view>
			<view class="direction-btn position-absolute a-center j-center rounded-circle" style="left: 310rpx;top: 105rpx;" @touchstart="opera(239)" @touchend="rightMoveEnd(255)" hover-stay-time="50" hover-class="btn-hover">
				<image :src="assetsConfig.gameRightImage" class="direction-btn-image"></image>
			</view>
			<view class="direction-btn position-absolute a-center j-center rounded-circle" style="left: 175rpx;top: 15rpx;" @touchstart="opera(127)" @touchend="clickHandler(255)" hover-stay-time="50" hover-class="btn-hover">
				<image :src="assetsConfig.gameUpImage" class="direction-btn-image"></image>
			</view>
			<view class="direction-btn position-absolute a-center j-center rounded-circle" style="left: 175rpx;top:205rpx" @touchstart="opera(191)" @touchend="clickHandler(255)" hover-stay-time="50" hover-class="btn-hover">
				<image :src="assetsConfig.gameDownImage" class="direction-btn-image"></image>
			</view>
		</view>
		<view class="flex j-center a-center pr-4">
			<view class="a-center position-relative" style="margin-top: -40rpx;left: 20rpx;" @touchstart="opera(247)" hover-stay-time="50" hover-class="btn-hover">
				<image :src="status == 1 ? assetsConfig.gameEnterImage : assetsConfig.gameWaitingResultImage" style="width: 200rpx;height:140rpx"></image>
				<text v-if="status == 1" class="position-absolute font-weight font-md" style="top:35rpx;left:110rpx;color: #F1F1F1;font-size: 38rpx;">{{countdownTime}}s</text>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		mapState,
		mapGetters
	} from 'vuex';
	export default {
		name:"wwj-game-controlpanel",
		props: {
			player: {
				type: Object,
				default: {}
			},
			status:{
				type:[Number],
				default:0
			},
			panelHeight:{
				type:[Number],
				default:0
			},
			gameStopTime:{
				type:[String,Number],
				default:0
			},
			operUrl: {
				type: String,
				default: ''
			},
			operToken: {
				type: String,
				default: ''
			},
		},
		data() {
			return {
				utils: uni.$api.helper,
				assetsConfig: uni.$api.assetsConfig,
				countdownTime:0,
				leftPress:false,
				leftEndTime:0,
				rightEndTime:0,
				lastCmd: 0,
			}
		},
		computed: {
			...mapState(['userInfo','offsetTime','serverConf']),
		},
		mounted(){
			if(this.gameStopTime > 0){
				this.setInterval(this.gameStopTime);
			}
		},
		deactivated(){
			console.log("wwj-game-controlpanel deactivated");
			this.clearInterval();
		},
		destroy(){
			this.clearInterval();
		},
		watch: {
			gameStopTime(newValue, oldValue) {
				if(newValue > 0){
					this.setInterval(newValue);
				}
			}
		},
		methods: {
			leftMoveEnd(){
				this.clickHandler(255);
			},
			rightMoveEnd(){
				this.clickHandler(255);
			},
			opera(cmd) {
				uni.$u.throttle(this.clickHandler(cmd),100,true);
			},
			clickHandler(cmd){
				if(this.status != 1 || !this.player || this.player.userName != this.userInfo.id || !this.operToken){
					return;
				}
				
				/* if(cmd != 255 && cmd != 247){
					this.$emit("clickDirectionBtn")
				} */
				
				if(cmd == 247){
					if(this.lastCmd == 0){
						this.utils.toast("请先移动爪子~");
						return;
					}else if(this.lastCmd != 255){
						this.lastCmd = 255;
						return;
					}
				}
				
				uni.$api.http.post(this.operUrl + "/operate/cmd",{
					cmd:cmd,
					operToken:this.operToken,
				}).then(res=>{
					this.lastCmd = cmd;
					
					if(cmd === 247){
						this.status = 2;
						this.clearInterval();
						this.$emit("clickEnterBtn");
					}
				}).catch(err=>{
				});
			},
			clearInterval(){
				console.log("clear countdown")
				if(this.timer) {
					clearInterval(this.timer);  
					this.timer = null;  
				} 
			},
			setInterval(stopTime){
				this.clearInterval();
				this.countdownTime = Number(this.gameStopTime - uni.$api.helper.getLocalTimestamp() - this.offsetTime);
				this.timer = setInterval( () => {
					if(this.countdownTime > 0){
						this.countdownTime --;	
					}else {
						this.clearInterval();
					}
				}, 1000)
			}
		},
	}
</script>

<style>
	.direction-btn{
		width: 130rpx;
		height:130rpx;
		background-color:#e3e3e3;
		border-style: solid;
		border-color: #d9d9d9;
		border-width: 3rpx;
		box-shadow: 0rpx 0rpx 4rpx rgba(0, 0, 0, 0.2);
	}
	.direction-btn-image{
		width: 70rpx;
		height:70rpx;
	}
	.btn-hover{
		opacity:0.3;
	}
</style>
