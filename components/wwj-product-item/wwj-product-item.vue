<template>
		<view
			class="dz-product-item box-shadow-item mt-1"
			@tap.stop="$u.throttle(click(data), 500)"
			:class="[direction==='horizontal' ? 'dz-product-flex-list' : '']"
			hover-class="hover"
			:hover-start-time="150"
			:style="{borderRadius:`${radius}rpx`}">
			<view class="dz-product-image-wrapper">
				<dz-image :src="$api.helper.formatImg(data.thumbnail)" :borderRadius="parseInt(radius)" :mode="direction==='horizontal' ? 'aspectFill' : 'widthFix'"></dz-image>
				<view class="triangle-wrapper">
					<image class="triangle-tag" :src="data | filterTagName"></image>
				</view>
			</view>
			<view class="dz-pro-content">
				<view class="dz-pro-tit">
					{{ data.name }}
				</view>
				<view class="line">
					<view class="dz-pro-price">
						<dz-tag  mode="plain" type="info" size="mini" shape="radius">
							<text class="dz-sale-price" :style="{ color: theme.dzBaseColor }">
								{{ data.jifen}}
							</text>
							<text class="dz-sale-price-unit" :style="{ color: theme.dzBaseColor }">
								积分
							</text>
						</dz-tag>
						<text class="dz-factory-price" v-if="marketCoinShow == 1 && data.coinOri && data.coin != data.coinOri">
							{{ data.coinOri}}
						</text>
					</view>
				</view>
			</view>
		</view>
</template>

<script>
import { mapState } from 'vuex';
export default{
	data(){
		return {
			
		}
	},
	props:{
		data:{
			type: Object,
			default() {
				return {};
			}
		},
		//取值横向排列horizontal，竖向排列vertical
		direction:{
			type:String,
			default:'vertical'
		},
		theme: {
			type: Object,
			default() {
				return {};
			}
		},
		radius: {
			type: [String, Number],
			default: 0
		},
		// 左右边距
		leftRight: {
			type: [String, Number],
			default: 0
		},
		// 上下边距
		topBottom: {
			type: [String, Number],
			default: 0
		},
		// 是否显示划线金币，即市场价金币
		marketCoinShow: {
			type: [String, Number],
			default: 1
		}
	},
	filters:{
		filterTagName(val) {
			/* let tagName = '';
			switch(val.tag){
				case:1
				tagName='新品图标'
			} */
		}
	},
	methods: {
		click(item) {
			this.$emit("click",item);
		}
	},
}	
	
</script>

<style lang="scss" scoped>
	.dz-product-item {
		width: 100%;
		margin-bottom: 20rpx;
		box-sizing: border-box;
		background: #fff;
		border-radius: 30rpx;
		overflow: hidden;
		transition: all 0.15s ease-in-out;
		// border: 0px solid black;
	}
	.dz-product-list-item {
		// width: 48vw;
		width: 100%;
		box-sizing: border-box;
	}
	.dz-product-flex-list {
		width: 100%;
		display: flex;
		// margin-bottom: 10rpx !important;
		padding: 20rpx 0 2rpx !important;
	}
	.dz-product-image-wrapper {
		// border-radius: 6rpx;
		overflow: hidden;
		position: relative;
		padding-top: 12rpx;
		padding-left: 12rpx;
		padding-right: 12rpx;
		flex-shrink: 0;
		.dz-product-img {
			// width: calc(50vw - 20rpx);
			// height: calc(50vw - 20rpx) !important;
			width: 100%;
			border-radius: 19rpx;
			// border-radius: 12rpx;
			display: block;
		}
		.dz-product-list-img {
			border-radius: 19rpx;
			// width: 400rpx;
			// height: 240rpx !important;
			width: 252rpx;
			height: 252rpx !important;
			display: block;
			flex-shrink: 0;
			background-color: $dz-bg-color;
		}
		.sketch {
			width: 100%;
			background-color: rgba(0, 0, 0, 0.4);
			position: absolute;
			border-bottom-left-radius: 6rpx;
			bottom: 0;
			padding: 0 8rpx;
			right: 0;
			color: #fff;
			font-size: 24rpx;
		}
		.triangle-wrapper {
			border-top-left-radius: 6rpx;
			position: absolute;
			overflow: hidden;
			top: 0;
			left: 0;
			.triangle-tag {
				width: 64rpx;
				height: 64rpx;
			}
		}
	}
	.dz-pro-content {
		width: 100%;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		position: relative;
		box-sizing: border-box;
		padding-left: 20rpx;
		padding-right: 20rpx;
		padding-bottom: 20rpx;
		.dz-pro-tit {
			// height: 64rpx; //这里的高度必须为line-height*显示行数
			color: $dz-main-color;
			font-size: 26rpx;
			line-height: 32rpx;
			word-break: break-all;
			overflow: hidden;
			text-overflow: ellipsis;
			display: -webkit-box;
			-webkit-box-orient: vertical;
			-webkit-line-clamp: 2;
		}
		.dz-pro-price {
			padding-top: 18rpx;
		}
		.dz-sale-price {
			color: #000000;
			font-size: 30rpx;
			font-weight: 550;
		}
		.dz-sale-price-unit {
			color: #000000;
			font-size: 20rpx;
			font-weight: 500;
		}
		.dz-factory-price {
			font-size: 24rpx;
			color: $dz-tips-color;
			text-decoration: line-through;
			padding-left: 12rpx;
		}
		.dz-pro-pay {
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding-top: 10rpx;
			font-size: 24rpx;
			color: $dz-content-color;
			.iconfont {
				font-size: 38rpx;
				padding: 0 10rpx;
			}
		}
		.cart {
			position: absolute;
			right: 20rpx;
			bottom: 20rpx;
			width: 52rpx;
			height: 52rpx;
		}
	}

.dz-product-bg-list {
	padding: 4rpx 0rpx 2rpx 24rpx;
	background: #ffffff;
}
.line{
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding-right: 10upx;
	font-size: 24upx;
}

.box-shadow-item{
		box-shadow: 0rpx 0rpx 15rpx rgba(0, 0, 0, 0.2);
}
</style>
