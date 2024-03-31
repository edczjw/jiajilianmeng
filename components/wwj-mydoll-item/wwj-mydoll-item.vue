<template>
		<view
			class="dz-mydoll-item box-shadow-item mt-1"
			@tap.stop="$u.throttle(click(data), 500)"
			:class="[direction==='horizontal' ? 'dz-mydoll-flex-list' : '']"
			hover-class="hover"
			:hover-start-time="150"
			:style="{borderRadius:`${radius}rpx`}">
			<view class="dz-mydoll-image-wrapper">
				<u-image :src="$api.helper.formatImg(data.thumbnail)" :radius="20" :height="315" :width="315" :mode="direction==='horizontal' ? 'aspectFill' : 'widthFix'"></u-image>
				<view class="triangle-wrapper" v-if="data.status == 1">
					<u-checkbox :name="data.id"  size="50" iconSize="30"></u-checkbox>
				</view>
				
				<view class="tag-wrapper">
					<u-tag v-if="data.status == 2" text="已兑换积分" size="mini" type="success" shape="circle"></u-tag>
					<u-tag v-else-if="data.status == 3 && data.orderStatus == 1" text="等待发货" size="mini" type="warning" shape="circle"></u-tag>
					<u-tag v-else-if="data.status == 3 && data.orderStatus == 2" text="已发货" size="mini" shape="circle"></u-tag>
					<u-tag v-else-if="data.status == 3 && data.orderStatus == 3" text="已完成" size="mini" type="success" shape="circle"></u-tag>
					<u-tag v-else-if="data.status == 1 && data.stock <= 10 && data.stock > 0" :text="'仅剩' + data.stock + '件'" size="mini" type="warning" shape="circle"></u-tag>
					<u-tag v-else-if="data.status == 1 && data.stock == 0" text="等待补货" size="mini" type="error" shape="circle"></u-tag>
				</view>
			</view>
			<view class="dz-pro-content" @click.stop="toDetail(data)">
				<view class="dz-pro-tit">
					{{ data.dollName }}<text v-if="data.status != 3">({{ data.exchangeJifen }}积分)</text>
				</view>
				<view class="line">
					{{ data.createTime }}
				</view>
			</view>
		</view>
</template>

<script>
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
	methods: {
		click(item) {
			this.$emit("click",item);
		},
		toDetail(item){
			this.$api.router.push({
				route: this.$api.pagesConfig["myDollDetail"],
				query: {id: item.id}
			});
		}
	},
}	
	
</script>

<style lang="scss" scoped>
	.dz-mydoll-item {
		width: 100%;
		margin-bottom: 20rpx;
		box-sizing: border-box;
		background: #fff;
		border-radius: 30rpx;
		overflow: hidden;
		transition: all 0.15s ease-in-out;
		// border: 0px solid black;
	}
	.dz-mydoll-flex-list {
		width: 100%;
		display: flex;
		// margin-bottom: 10rpx !important;
		padding: 20rpx 0 2rpx !important;
	}
	.dz-mydoll-image-wrapper {
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
		.triangle-wrapper {
			border-top-left-radius: 6rpx;
			position: absolute;
			overflow: hidden;
			top: 20rpx;
			right: 15rpx;
			.triangle-tag {
				width: 64rpx;
				height: 64rpx;
			}
		}
		.tag-wrapper {
			border-top-left-radius: 6rpx;
			position: absolute;
			overflow: hidden;
			top: 20rpx;
			left: 20rpx;
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
			color: #646464;
			font-weight: 700;
			font-size: 26rpx;
			line-height: 32rpx;
			word-break: break-all;
			overflow: hidden;
			text-overflow: ellipsis;
			display: -webkit-box;
			-webkit-box-orient: vertical;
			-webkit-line-clamp: 2;
		}
	}

.line{
	color: #7f7f7f;
	font-weight: 600;
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
