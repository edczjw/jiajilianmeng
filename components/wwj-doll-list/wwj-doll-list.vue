<template>
	<view class="dz-product-list" :class="[direction==='horizontal' ? 'dz-product-bg-list' : '']" :style="{
			margin: `${topBottom}rpx ${leftRight}rpx`,

			borderRadius: direction==='horizontal' ? `${radius}rpx` : '',
			overflow: 'hidden'
		}">
		<view class="dz-product-list-container" :style="{ marginRight: direction==='horizontal' ? 0 : '20rpx' }">
			<block v-for="(item, index) in list" :key="index">
				<!--商品列表-->
				<view v-if="(index + 1) % 2 !== 0 || direction==='horizontal'">
					<wwj-doll-item :data="item" :direction="direction" :radius="radius" :theme="theme" @popMachineList="popMachineList">
					</wwj-doll-item>
				</view>
				<!--商品列表-->
			</block>
		</view>
		<view class="dz-product-list-container" v-if="direction !='horizontal'" style="margin-right: 0;">
			<block v-for="(item, index) in list" :key="index">
				<!--商品列表-->
				<view v-if="(index + 1) % 2 === 0">
					<wwj-doll-item :data="item" :direction="direction" :radius="radius" :theme="theme" @popMachineList="popMachineList">
					</wwj-doll-item>
				</view>
				<!--商品列表-->
			</block>
		</view>
		<!-- 规格弹窗 -->
		<!-- <dz-popup v-model="specShow" mode="bottom" border-radius="40" closeIcon="roundclose" closeIconSize="40" :closeable="true">
			<shop-attr-content :product="productDetail" :buyNumber="currentNumber" buttonName="加入购物车" @confirm="attrConfirmClick"></shop-attr-content>
		</dz-popup> -->
		<dz-toast ref="dzToast"></dz-toast>
	</view>
</template>

<script>
	import assetsConfig from '@/core/config/assetsConfig';
	import {
		mapState
	} from 'vuex';
	export default {
		data() {
			return {
				language: this.$api.language,
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
		filters: {

		},
		computed: {
			...mapState(['userInfo'])
		},
		methods: {
			popMachineList(data){
				this.$emit("popMachineList",data);
			}
		},
		created() {
			
		},
		mounted() {
			
		},
	};
</script>

<style lang="scss" scoped>
	.dz-product-list {
		// background-color: $dz-bg-color;
		// padding: 0 20rpx;
		display: flex;
		justify-content: space-between;
		flex-direction: row;
		flex-wrap: wrap;
		box-sizing: border-box;

		.dz-product-list-container {
			flex: 1;
			margin-right: 20rpx;
		}

		.dz-product-list-container:last-child {
			margin-right: 0rpx !important;
		}

	}

	.dz-product-bg-list {
		padding: 4rpx 0rpx 2rpx 24rpx;
		background: #ffffff;
	}
</style>
