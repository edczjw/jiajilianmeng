<template>
	<view class="body" :style="{backgroundImage: 'url('+scenes[scenesIndex]+')'}"  @touchmove="onTouchSheepMove" @touchstart="onTouchSheepStart" @touchend="onTouchSheepEnd">
		<image :src="assetPath+'/back_icon.png'" class="back_icon" mode="heightFix" @tap="back()"></image>
		<view class="hay_box">
			<image :src="assetPath+'/hay_icon.png'" class="hay_icon" mode="heightFix"></image>
			<text v-if="gameStatus!='run'">{{sumScore}}</text>
			<text v-if="gameStatus=='run'">{{gameScore}}</text>
			<image v-if="addHayAniTimer"  :src="assetPath+'/hay.png'" class="hay-ani" mode="widthFix"></image> 
		</view>
		<view class="ext-box">
			<view class="ext-item">
				<image :src="assetPath+'/dresscode_icon.png'" mode="heightFix" @tap="changeShowDresscodeModal()"></image>
			</view>
			<view class="ext-item">
				<image :src="assetPath+'/scenes_icon.png'" mode="heightFix" @tap="changeShowScenesModal()"></image>
			</view>
		</view>
		<view v-if="gameStatus=='tip'" class="game-tip-box">
			<view class="game-tip">
				<view>玩法提示：</view>
				<view>左右移动小羊赢取牧草，马上开始了</view>
			</view>
		</view>
		<view v-show="gameStatus=='run' || gameStatus=='time' || gameStatus=='over'"  class="run-down-time-box">
			<text>{{gameDownText}}</text>
		</view>
		<view v-show="gameStatus=='time'" class="down-time-box">
			<image v-for="(src,k) in times" v-show="k==downTimeIndex" :src="src" mode="heightFix"></image>
		</view>
		<view v-show="gameStatus=='unstart'" class="start-btn-box">
			<image :src="assetPath+'/btn_start.png'" @tap="clickStartBtn()"  mode="heightFix"></image>
		</view>
		<view v-if="gameStatus=='run' && hays.length" class="hays" :style="{height:haysHeight+'px'}"> 
			<image class="hay" v-for="(item,index) in hays" :src="assetPath+'/hay.png'" :style="{left:item.ml+'px',marginTop:item.mt+'px',transform: 'rotate('+item.tf+'deg)'}"></image>
		</view> 
		<view class="sheep-box" :style="{top:sheepTop+'px'}">
			<image class="sheep" id="sheep" :src="sheeps[sheepIndex]" mode="widthFix" :style="{marginLeft:sheepLeft+'px'}" ></image>
		</view>
		<view class="over-box" v-if="gameStatus=='over'">
			<view class="over" :style="{backgroundImage:'url('+assetPath+'/modal_bg.png)'}">
				<image :src="assetPath+'/end_text.png'" style="width: 140rpx;" mode="widthFix"></image>
				<image :src="assetPath+'/close_icon.png'" style="width: 40rpx;position: absolute;right: 10rpx;top: 10rpx;" mode="widthFix" @tap="reset()"></image>
				<view class="over-detail">
					获得牧草{{gameScore}}捆
				</view>
			</view>
			<!--创造不易，鼓励鼓励！-->
			<view style="text-align: center;">
				<image src="../../static/guli.png" style="width: 400rpx;" mode="widthFix"></image> 
			</view>
		</view>
		<view class="dresscode-box" v-show="isShowDresscode">
			<view class="dresscode" :style="{backgroundImage:'url('+assetPath+'/modal_bg.png)'}">
				<view style="display: flex;width: 100%;justify-content: center;">
					<view style="flex-grow: 1;text-align: center;margin-left: 40rpx;"> 
						<image :src="assetPath+'/dresscode_text.png'" style="width: 80rpx;" mode="widthFix"></image>
					</view>
					<image :src="assetPath+'/close_icon.png'" class="close-dresscode" style="" mode="widthFix" @tap="changeShowDresscodeModal()"></image>
				</view>
				
				<view class="dresscode-detail">
					<view class="detail-rows">
						<image v-for="(item,index) in dcs" :src="item" mode="widthFix" :class="sheepIndex==index?'active':''" @tap="sheepIndex=index"></image>
					</view>
					<view class="confirm-box">
						<image :src="assetPath+'/btn_confrim.png'" mode="heightFix" @tap="saveSheepDresscode"></image>
					</view>
				</view>
			</view>
		</view>
		<view class="dresscode-box" v-show="isShowScenes">
			<view class="dresscode" :style="{backgroundImage:'url('+assetPath+'/modal_bg.png)'}">
				<view style="display: flex;width: 100%;justify-content: center;">
					<view style="flex-grow: 1;text-align: center;margin-left: 40rpx;"> 
						<image :src="assetPath+'/scenes_text.png'" style="width: 80rpx;" mode="widthFix"></image>
					</view>
					<image :src="assetPath+'/close_icon.png'" class="close-dresscode" style="" mode="widthFix" @tap="changeShowScenesModal()"></image>
				</view>
				
				<view class="dresscode-detail">
					<view class="detail-rows">
						<image v-for="(item,index) in scenesdemos" :src="item" mode="widthFix" :class="scenesIndex==index?'active':''" @tap="scenesIndex=index"></image>
					</view>
					<view class="confirm-box">
						<image :src="assetPath+'/btn_confrim.png'" mode="heightFix" @tap="saveScenes"></image>
					</view>
				</view>
			</view>
		</view>
		
	</view>
</template>
<style>
	.hay-ani{
		position: absolute;
		width: 40rpx;
		right: 0;
		top: 50rpx;
		animation: hayani 0.2s 0s linear infinite;
	}
	@keyframes hayani {
		from {
			right:-50rpx;
			top: 200rpx;
			width: 80rpx;
		}
		to {
			right: 0;
			top: 50rpx;
			width: 40rpx;
		}
	}
	.confirm-box{
		text-align: center;
	}
	.confirm-box image{
		height:80rpx;
	}
	
	.detail-rows{
		display: flex;
		justify-content: space-around;
		flex-wrap: wrap;
		padding-bottom: 10rpx;
	}
	.detail-rows image{
		width: 30%;
		margin-top: 15rpx;
		box-shadow: 0 0 10rpx #ffd608;
		border-radius: 14rpx;
		border: 2px solid #AEAEAE;
		max-height: 160rpx;
	}
	.active{
		border: 2px solid red !important;
	}
	.dresscode-detail{
		
	}
	.dresscode-box{
		position: fixed;
		top: 30vh;
		z-index: 5;
		left: 0;
		right: 0;
	}
	.dresscode{
		height: 500rpx;
		width: 500rpx;
		background-size: 100%;
		background-repeat:  no-repeat;
		z-index: 5;
		margin: 0 auto;
		border-radius: 20rpx;
		padding: 20rpx;
		position: relative;
	}
	.close-dresscode{
		width: 40rpx;
	}
	.over-box{
		position: fixed;
		top: 40vh;
		z-index: 5;
		left: 0;
		right: 0;
		text-align: center;
	}
	.over{
		height: 300rpx;
		width: 430rpx;
		background-size: 100%;
		background-repeat:  no-repeat;
		z-index: 5;
		margin: 0 auto;
		border-radius: 20rpx;
		padding: 20rpx;
		position: relative;
	}
	.over-detail{
		line-height: 160rpx;
		font-size: 40rpx;
		color: #ff8902;
		font-weight: bold;
		text-shadow:#000 1px 0 0,#000 0 1px 0,#000 -1px 0 0,#000 0 -1px 0;
		letter-spacing:5px;
	}
	.hays{
		position: relative;
		top: 0;
		left: 0;
		right: 0;
		z-index: 3;
	}
	.hays image{
		width: 50px;
		height: 50px;
		z-index: 4;
		position: absolute;
	} 

	.run-down-time-box{
		position: fixed;
		top: 230rpx;
		left: 0;
		right: 0;
		text-align: center;
		width: 100%;
		z-index: 2;
		height: 100rpx;
		line-height: 100rpx;
		
	}
	.run-down-time-box text{
		font-size: 60rpx;
		color: #FFFFFF;
		font-weight: bold;
		letter-spacing:6rpx;
	}
	.down-time-box{
		position: relative;
		top: 500rpx;
		left: 0;
		right: 0;
		text-align: center;
		z-index: 2;
		height: 200rpx;
		line-height: 200rpx;
		display: flex;
		align-items: center;
	}
	.down-time-box image{
		height: 120rpx;
		z-index: 2;
		display: inline-block;
		margin: 0 auto;
		align-items: center;
		max-width: 120rpx;
		animation: timeani 0.5s;
	}
	@keyframes timeani
	{
		0%   {height: 90rpx;}
		60%  {height: 135rpx;}
		70%  {height: 130rpx;}
		80%  {display: none;}
	}
	.game-tip-box{
		position: relative;
		top: 300rpx;
		left: 0;
		right: 0;
		z-index: 2;
	}
	.game-tip{
		left: 120rpx;
		background-color: rgba(0, 0, 0, 0.4);
		color: #FFFFFF;
		text-align: left;
		right: 120rpx;
		position: absolute;
		line-height: 50rpx;
		padding: 30rpx;
		border-radius: 20rpx;
		font-size: 14px;
	}
	.start-btn-box{
		position: fixed; 
		z-index: 1;
		top: 600rpx;
		left: 0;
		right: 0;
		text-align: center;
	}
	.start-btn-box image{
		height: 150rpx;
	}
	.sheep-box{
		position: fixed;
		left: 0;
		right: 0;
		height: 500px;
	}
	.sheep{
		width: 100px; 
	}
	.body {
		margin: 0;
		padding: 0;
		background-size: 100% 100%;
		background-repeat: no-repeat;
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: -1;
	}

	.back_icon{
		position: fixed;
		height: 60rpx;
		left: 30rpx;
		top: 80rpx;
		z-index:0;
	}
	.hay_box{
		height: 100rpx;
		line-height: 100rpx;
		width: 180rpx;
		left: 30rpx;
		top: 200rpx;
		z-index:0;
		position: relative;
	}
	.hay_icon{
		height: 100%;
		position: absolute;
		z-index: 0;
	}
	.hay_box text{
		line-height: 100rpx;
		z-index: 1;
		width: 80rpx;
		position: absolute;
		right: 14rpx;
		text-align: center;
		font-size: 40rpx;
		color: #fff;
	}
	.ext-box{
		position: fixed;
		right: 0rpx;
		top: 120rpx;
		width: 130rpx;
		text-align: left;
		z-index: 1;
	}
	.ext-item{
		width: 100%;
		height:110rpx;
		margin-top: 40rpx;
	}
	.ext-item>image{
		height: 110rpx;
	}
	
</style>

<script>
	export default {
		data() {
			return {
				windowHeight:0,
				windowWidth:0,
				scenesIndex:0,
				sheepIndex:0,
				assetPath:'../../static/game_cc',
				sumScore:0,
				sheepLeftMin:-10,
				sheepLeftMax:200,
				sheepLeft:120,
				sheepTop:10000,
				sheepWidth:100,
				haysHeight:0,
				gameStatus:'unstart',//unstart tip time run over ,
				downTimeIndex:0,
				gameDownTime:60,
				gameScore:0,
				gameSheepMoveStartX:0,
				gameMoveStartX:0,
				gameMoveX:0,
				hays:[],
				isShowDresscode:false,
				isShowScenes:false,
				bgAudio:null,
				sheepMoveTime:0,
				sheepMoveTimer:null,
				addHayAniTimer:null
			}
		},
		computed:{
			gameDownText(){
				let r=[];
				if(this.gameDownTime>=60){
					r.push("0"+parseInt(this.gameDownTime/60));
				}else{
					r.push("00");
				}
				let s=this.gameDownTime%60;
				if(s<10){
					s='0'+s;
				}
				r.push(s);
				return r.join(":");
			},
			times(){
				return [
					this.assetPath+'/time3.png',
					this.assetPath+'/time2.png',
					this.assetPath+'/time1.png',
				];
			},
			sheeps(){
				return [
					this.assetPath+'/sheep/s1.png',
					this.assetPath+'/sheep/s2.png',
					this.assetPath+'/sheep/s3.png',
					this.assetPath+'/sheep/s4.png',
					this.assetPath+'/sheep/s5.png',
					this.assetPath+'/sheep/s6.png',
				];
			},
			scenes(){
				return [
					this.assetPath+'/scenes/scenes1_bg.png',
					this.assetPath+'/scenes/scenes2_bg.png',
					this.assetPath+'/scenes/scenes3_bg.png',
					this.assetPath+'/scenes/scenes4_bg.png',
					this.assetPath+'/scenes/scenes5_bg.png',
					this.assetPath+'/scenes/scenes6_bg.png',
				];
			},
			dcs(){
				return [
					this.assetPath+'/dc1.png',
					this.assetPath+'/dc2.png',
					this.assetPath+'/dc3.png',
					this.assetPath+'/dc4.png',
					this.assetPath+'/dc5.png',
					this.assetPath+'/dc6.png',
				];
			},
			scenesdemos(){
				return [
					this.assetPath+'/scenes1.png',
					this.assetPath+'/scenes2.png',
					this.assetPath+'/scenes3.png',
					this.assetPath+'/scenes4.png',
					this.assetPath+'/scenes5.png',
					this.assetPath+'/scenes6.png',
				];
			}
		},
		onLoad() {
			this.sheepIndex=uni.getStorageSync('gamecc-sheepindex') || 0;
			this.scenesIndex=uni.getStorageSync('gamecc-scenes') || 0; 
			
		},
		onReady() {
			uni.getSystemInfo({
				success:  (res)=> {
					this.windowWidth=res.windowWidth;
					this.sheepLeftMax=this.windowWidth-90;
					this.sheepLeftMin=-10; 
					this.windowHeight=res.windowHeight;
					uni.createSelectorQuery().in(this).select('#sheep').boundingClientRect(data => {
					  this.sheepWidth=data.width;
					  this.sheepTop=this.windowHeight*0.74; 
					  this.haysHeight=this.sheepTop+parseInt(data.height/5); 
					}).exec();
					
				}
			});
			this.bgAudio=uni.createInnerAudioContext();
			this.bgAudio.autoplay = true;
			this.bgAudio.loop=true; 
			this.bgAudio.src = this.assetPath+ '/mp3/bg.mp3';
			this.bgAudio.play();
		},
		onUnload() {
			if(this.bgAudio){
				this.bgAudio.destroy();
			}
		},
		onHide() {
			console.log("---------------------------")
			if(this.bgAudio){
				this.bgAudio.stop();
			}
		},
		onShow() {
			console.log("---------------------------")
			if(this.bgAudio){
				this.bgAudio.play();
			}
		},
		
		methods: {
			addSumSocreAnim(amount,then){
				this.addHayAniTimer=setInterval(()=>{
					if(amount<=0){
						clearInterval(this.addHayAniTimer);
						this.addHayAniTimer=null;
						if(then){
							then();
						}
						return;
					}else{
						amount--;
						this.sumScore++;
					}
				},10)
			},
			saveScenes(){
				uni.setStorageSync('gamecc-scenes',this.scenesIndex);
				this.isShowScenes=false;
			},
			saveSheepDresscode(){
				uni.setStorageSync('gamecc-sheepindex',this.sheepIndex);
				this.isShowDresscode=false;
			},
			playDownTimeAudio(){
				var innerAudioContext = uni.createInnerAudioContext();
				innerAudioContext.autoplay = true;
				innerAudioContext.src = this.assetPath+ '/mp3/time3.mp3';
				innerAudioContext.onEnded(function(){
					innerAudioContext.destroy();
					innerAudioContext=null;
				})
				innerAudioContext.play();
			},
			playScoreAudio(){
				var innerAudioContext = uni.createInnerAudioContext();
				innerAudioContext.autoplay = true;
				innerAudioContext.src = this.assetPath+ '/mp3/df.mp3';
				innerAudioContext.onEnded(function(){
					innerAudioContext.destroy();
					innerAudioContext=null;
				})
				innerAudioContext.play();
			},
			clickStartBtn(){
				console.log("----------------")
				
				this.bgAudio.pause();
				this.gameStatus='tip';
				this.downTimeIndex=0;
				this.gameDownTime=60;
				setTimeout(()=>{
					this.gameStatus="time";
					this.playDownTimeAudio();
					var interval=setInterval(()=>{
						if(this.downTimeIndex>=this.times.length-1){
							clearInterval(interval);
							this.gameDownTime--;
							this.runGame(); 
							return;
						}else{
							this.downTimeIndex++;
							return;
						}
					},1000);
				},1000);
			},
			
			runGame(){
				this.gameStatus='run';
				this.gameScore=0;
				this.hays=[];
				var that=this;
				var time=0;
				var limit=10; 
				var hay_limit=600;//落草间隔
				var max_height=that.haysHeight-50;
				var max_hays=4;
				var tv=40;
				function randMl(){
					var ml=that.windowWidth-50;
					return parseInt(Math.random()*ml);
				}
				function randTf(){
					return parseInt(Math.random()*360);
				}
				function randTv(){
					return tv+parseInt(Math.random()*10);
				}
				function randMt(){
					return 0-parseInt(Math.random()*20);
				}
				function getHayItem(item){
					item.ml=randMl();
					item.mt=randMt();
					item.tv=randTv();
					item.tf=randTf();
					return item;
				}
				function loop(){
					if(that.gameStatus=='run'){
						time+=limit;
						//游戏时间
						if(time%1000==0){
							that.gameDownTime--;
							if(that.gameDownTime<=0){
								return that.gameOver(); 
							}
						} 
						//落草
						var len=that.hays.length;
						if(len<max_hays){
							if(time%hay_limit==0){
								that.hays.push(getHayItem({}));
								++len;
							}
						}
						
						for(var i=0;i<len;i++){
							(function(i){
								//降落
								var item=that.hays[i];
								item.tv*=1.02;
								if(item.mt<max_height){
									item.mt+=2+parseInt(item.tv*0.01); 
								}
								//重新降落
								if(item.mt>=max_height){
									return getHayItem(item);
								}
								//吃草
								if(item.mt>=that.sheepTop-40){
									if(item.ml+50>that.sheepLeft){ 
										if(item.ml<that.sheepLeft+that.sheepWidth){
											that.playScoreAudio(); 
											that.gameScore+=1;  
											return getHayItem(item);
										}
									}
								}
							})(i);  
						}
						setTimeout(loop,limit); 
					}
				}
				loop();
				
				
				
			},
			gameOver(){
				this.hays=[];
				this.gameStatus="over";
				this.bgAudio.play();
			}, 
			reset(){
				if(this.gameScore>0){
					let amount=this.gameScore*1;
					this.addSumSocreAnim(amount,()=>{
						
					});
					this.gameScore=0;
				}else{
					
				}
				this.gameStatus="unstart"; 
			},
			onTouchSheepMove(e){
				if(this.gameStatus=='run'){
					var now=Date.now(); 
					if(now-this.sheepMoveTime>10){
						this.sheepMoveTime=now;
						if(this.sheepMoveTimer){
							clearTimeout(this.sheepMoveTimer)
						}
						this.sheepMoveTimer=setTimeout(()=>{
							this.gameMoveX=e.touches[0].pageX;
							if(this.gameMoveStartX>0){
								var diffX= this.gameMoveX-this.gameMoveStartX;
								var left=this.gameSheepMoveStartX+diffX;
								if(left<this.sheepLeftMin){
									left=this.sheepLeftMin;
								}
								if(left>this.sheepLeftMax){
									left=this.sheepLeftMax;
								}
								if(this.sheepLeft!=left){
									this.sheepLeft=left;
								}
							}
						},5);
					}
					
				}
			},
			onTouchSheepStart(e){ 
				if(this.gameStatus=='run'){
					this.gameMoveX=0;
					this.gameSheepMoveStartX=this.sheepLeft;
					this.gameMoveStartX=e.touches[0].pageX;
				}
			},
			onTouchSheepEnd(e){
				if(this.gameStatus=='run'){
					this.gameMoveX=0;
					this.gameMoveStartX=0;
				}
				
			},
			back(){
				if(this.gameStatus=="over"){
					return this.reset();
				}
				if(this.gameStatus=="unstart"){
					uni.navigateBack({
						
					})
				}
			},
			changeShowDresscodeModal(){
				this.isShowScenes=false;
				this.isShowDresscode=!this.isShowDresscode;
			},
			changeShowScenesModal(){
				this.isShowDresscode=false;
				this.isShowScenes=!this.isShowScenes;
			}
		}
	}
</script>

