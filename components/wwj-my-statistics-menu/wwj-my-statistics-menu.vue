<template>
	<view :style="{ padding: `${parseInt(config.props.paddingTop) * 2}rpx ${parseInt(config.props.leftRight) * 2}rpx ${parseInt(config.props.paddingBottom) * 2}rpx` }">
		<view
			class="shop-statistics-meun"
			:style="{
				backgroundColor: config.props.bgColor,
				borderRadius: parseInt(config.props.borderRadius) * 2 + 'rpx'
			}"
		>
			<dz-cell-item
				v-if="config.props.isCellItem == 1"
				:title="config.props.title"
				:value="config.props.value"
				:arrow="config.props.arrow == 1 ? true : false"
				:title-style="{
					'font-size': parseInt(config.props.fontSize) * 2 + 'rpx',
					color: '#333',
					'font-weight': config.props.isBold == 1 ? '700' : '500'
				}"
				:border-bottom="false"
			></dz-cell-item>
			<dz-grid :style="{ marginTop: `-${parseInt(config.props.paddingPushTop) * 2}rpx` }" :border="false" :col="config.props.col" v-if="hasLogin">
				<block v-for="(item, index) in config.props.list" :key="index">
					<dz-grid-item v-if="item.checked">
						<view class="dz-text-center" :style="{ color: config.props.color }" @tap.stop="click(item)">
							<view class="dz-font-weight" :style="{ 'font-size': parseInt(config.props.numFontSize) * 2 + 'rpx' }">
								<text v-if="item.key == 'account'">{{ userInfo.coin || 0 }}</text>
								<text v-if="item.key == 'integral'">{{ userInfo.jifen || 0 }}</text>
								<text v-if="item.key == 'collect'">{{ userInfo.collect || 0 }}</text>
								<text v-if="item.key == 'doll'">{{ userInfo.doll || 0 }}</text>
							</view>
							<view class="dz-m-t-4" :style="{ 'font-size': parseInt(config.props.titleFontSize) * 2 + 'rpx' }">{{ item.title }}</view>
						</view>
					</dz-grid-item>
				</block>
			</dz-grid>
		</view>
	</view>
</template>

<script>
export default {
	props: {
		config: {
			type: Object,
			default() {
				return {};
			}
		},
		userInfo: {
			type: Object,
			default() {
				return {};
			}
		},
		hasLogin: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			theme: this.$api.theme
		};
	},
	methods: {
		click(value) {
			this.$emit('click', value);
		}
	}
};
</script>

<style lang="scss" scoped>
.shop-statistics-meun {
	overflow: hidden;
}
</style>
