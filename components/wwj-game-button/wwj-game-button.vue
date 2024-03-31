<template>
	<view
	 class="a-center j-center" style="height: 200rpx;">
		<view class="" hover-class="btn-hover" style="" @click="click">
			<view class="d-flex flex-column a-center j-center" 
			:style="{width:this.width+'rpx',height:height+'rpx'}">
				<image :src="image" :style="{width:width+'rpx',height:height + 'rpx'}"></image>
				<text class="btn-text" :style="{width:width+'rpx',fontSize:textSize + 'rpx',color:'#fff',fontWeight:'bold'}">{{text}}</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name:"wwj-game-button",
		props: {
			bgColor:{
				type:String,
				default:"#fff"
			},
			width:{
				type:[String, Number],
				default:'30'
			},
			height:{
				type:[String,Number],
				default:'30'
			},
			image:{
				type:String,
				default:''
			},
			imageWidth:{
				type:[String, Number],
				default:20
			},
			imageHeight:{
				type:[String, Number],
				default:20
			},
			text:{
				type:String,
				default:''
			},
			textColor:{
				type:String,
				default:'#fff'
			},
			textSize:{
				type:[String, Number],
				default:22
			}
		},
		data() {
			return {
			}
		},
		methods: {
			click() {
				uni.$u.throttle(this.clickHandler, 500,true)
			},
			clickHandler(){
				this.$emit("click");
			}
		},
	}
</script>

<style>
	.hover-class-active{
		background-color: #000000;
	}
	.btn-text{
		position: absolute;bottom: 40rpx;text-align: center;
	}
</style>
