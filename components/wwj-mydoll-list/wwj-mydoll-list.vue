<template>
	<view class="dz-mydoll-list" :class="[direction==='horizontal' ? 'dz-mydoll-bg-list' : '']" :style="{
			padding: `${topBottom}rpx ${leftRight}rpx`,
			borderRadius: direction==='horizontal' ? `${radius}rpx` : '',
			overflow: 'hidden'
		}">
		
		<u-checkbox-group v-model="selectIds" style="width: 700rpx;">
		<view class="dz-mydoll-list-container" :style="{ marginRight: direction==='horizontal' ? 0 : '20rpx' }">
			<block v-for="(item, index) in list" :key="index">
				<!--我的娃娃列表-->
				<view v-if="(index + 1) % 2 !== 0 || direction==='horizontal'">
					<wwj-mydoll-item :data="item" :direction="direction" :radius="radius" :theme="theme" @click="clickItem">
					</wwj-mydoll-item>
				</view>
				<!--我的娃娃列表-->
			</block>
		</view>
		<view class="dz-mydoll-list-container" v-if="direction !='horizontal'" style="margin-right: 0;">
			<block v-for="(item, index) in list" :key="index">
				<!--我的娃娃列表-->
				<view v-if="(index + 1) % 2 === 0">
					<wwj-mydoll-item :data="item" :direction="direction" :radius="radius" :theme="theme" @click="clickItem">
					</wwj-mydoll-item>
				</view>
				<!--我的娃娃列表-->
			</block>
		</view>
		</u-checkbox-group>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				selectIds: []
			};
		},
		props: {
			// 列表
			list: {
				type: Array,
				default () {
					return [];
				}
			},
			//取值横向排列horizontal，竖向排列vertical
			direction: {
				type: String,
				default: 'vertical'
			},
			theme: {
				type: Object,
				default () {
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
			// 是否显示划线价格
			marketPriceShow: {
				type: [String, Number],
				default: 1
			},
			pageSize: {
				type: [String, Number],
				default: 10
			}
		},
		methods: {
			clickItem(data){
				if(this.selectIds.indexOf(data.id) != -1){
					this.selectIds.splice(this.selectIds.indexOf(data.id), 1)
				}else {
					this.selectIds.push(data.id);
				}
				
				this.$emit("showCount",this.selectIds);
			},
			removeSelectIds() {
				this.selectIds = [];
			}
		},
	};
</script>

<style lang="scss" scoped>
	.dz-mydoll-list {
		// background-color: $dz-bg-color;
		// padding: 0 20rpx;
		display: flex;
		justify-content: space-between;
		flex-direction: row;
		flex-wrap: wrap;
		box-sizing: border-box;

		.dz-mydoll-list-container {
			flex: 1;
			margin-right: 20rpx;
		}

		.dz-mydoll-list-container:last-child {
			margin-right: 0rpx !important;
		}

	}

	.dz-mydoll-bg-list {
		padding: 4rpx 0rpx 2rpx 24rpx;
		background: #ffffff;
	}
</style>
