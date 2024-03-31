<template>
	<view>
		<dz-navbar :isBack="false" title="活动" :titleBold="true" :titleSize="36" :borderBottom="false">
		</dz-navbar>
		<view class="position-relative">
			<image  src="../../static/image/activity_dw.png" style="width: 750rpx;height: 1333rpx;"></image>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			
		};
	},
	computed: {
	},
	async onLoad(option) {
	},
	onShow() {
		this.$api.http.get(this.$api.apiConfig.pages + "activity").then(res=>{}).catch(err=>{});
	},
	methods: {
	}
};
</script>

<style lang="scss" scoped>
.dz-poster-list {
	display: flex;
	justify-content: space-between;
	flex-direction: row;
	flex-wrap: wrap;
	box-sizing: border-box;
	margin: 20rpx 20rpx;
}

.dz-poster-container {
	flex: 1;
	margin-right: 20rpx;
}

.dz-poster-container:last-child {
	margin-right: 0;
}

.dz-pos-item {
	width: 100%;
	margin-bottom: 20rpx;
	background: #fff;
	box-sizing: border-box;
	border-radius: 20rpx;
	overflow: hidden;
	transition: all 0.15s ease-in-out;
}

.dz-pos-img {
	width: 100%;
	display: block;
}

.dz-pos-content {
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	box-sizing: border-box;
	padding: 20rpx;
}

.dz-pos-tit {
	color: $dz-main-color;
	font-size: 26rpx;
	word-break: break-all;
	overflow: hidden;
	text-overflow: ellipsis;
	display: -webkit-box;
	-webkit-box-orient: vertical;
	-webkit-line-clamp: 2;
}

/*海报*/

.hideCanvas {
	position: fixed;
	top: -99999upx;
	left: -99999upx;
	z-index: -99999;
}
</style>
