<template>
	<view class="dz-gap" :style="[gapStyle]"></view>
</template>

<script>
/**
 * gap 间隔槽
 * @description 该组件一般用于内容块之间的用一个灰色块隔开的场景，方便用户风格统一，减少工作量
 * @property {String} bg-color 背景颜色（默认#f3f4f6）
 * @property {String Number} height 分割槽高度，单位rpx（默认30）
 * @property {String Number} margin-top 与前一个组件的距离，单位rpx（默认0）
 * @property {String Number} margin-bottom 与后一个组件的距离，单位rpx（0）
 * @example <dz-gap height="80" bg-color="#bbb"></dz-gap>
 */
export default {
	name: "dz-gap",
	props: {
		bgColor: {
			type: String,
			default: 'transparent ' // 背景透明
		},
		// 高度
		height: {
			type: [String, Number],
			default: 30
		},
		// 与上一个组件的距离
		marginTop: {
			type: [String, Number],
			default: 0
		},
		// 与下一个组件的距离
		marginBottom: {
			type: [String, Number],
			default: 0
		},
	},
	computed: {
		gapStyle() {
			return {
				backgroundColor: this.bgColor,
				height: this.height + 'rpx',
				marginTop: this.marginTop + 'rpx',
				marginBottom: this.marginBottom + 'rpx'
			};
		}
	},
	methods:{
		test(){
			console.log("我被调了")
		}
	}
};
</script>

<style lang="scss" scoped>
	@import "../../css/style.components.scss";
</style>
