<template>
	<view
		@tap="click"
		class="dz-cell"
		:class="{ 'dz-border-bottom': borderBottom, 'dz-border-top': borderTop, 'dz-col-center': center, 'dz-cell--required': required }"
		hover-stay-time="150"
		:hover-class="hoverClass"
		:style="{
			backgroundColor: bgColor
		}"
	>
		<dz-icon :size="iconSize" :name="icon" v-if="icon" :custom-style="iconStyle" class="dz-cell__left-icon-wrap"></dz-icon>
		<view class="dz-flex" v-else>
			<slot name="icon"></slot>
		</view>
		<view
			class="dz-cell_title"
			:style="[
				{
					width: titleWidth ? titleWidth + 'rpx' : 'auto'
				},
				titleStyle
			]"
		>
			<block v-if="title != ''">{{ title }}</block>
			<slot name="title" v-else></slot>

			<view class="dz-cell__label" v-if="label || $slots.label" :style="[labelStyle]">
				<block v-if="label != ''">{{ label }}</block>
				<slot name="label" v-else></slot>
			</view>
		</view>

		<view class="dz-cell__value" :style="[valueStyle]">
			<block class="dz-cell__value" v-if="value != ''">{{ value }}</block>
			<slot v-else></slot>
		</view>
		<view class="dz-flex dz_cell_right" v-if="$slots['right-icon']">
			<slot name="right-icon"></slot>
		</view>
		<dz-icon v-if="arrow" name="right" :style="[arrowStyle]" :color="rightColor" class="dz-icon-wrap dz-cell__right-icon-wrap"></dz-icon>
	</view>
</template>

<script>
/**
 * cellItem 单元格Item
 * @description cell单元格一般用于一组列表的情况，比如个人中心页，设置页等。搭配dz-cell-group使用
 * @property {String} title 左侧标题
 * @property {String} icon 左侧图标名，只支持内置图标，见Icon 图标
 * @property {Object} icon-style 左边图标的样式，对象形式
 * @property {String} value 右侧内容
 * @property {String} label 标题下方的描述信息
 * @property {Boolean} border-bottom 是否显示cell的下边框（默认true）
 * @property {Boolean} border-top 是否显示cell的上边框（默认false）
 * @property {Boolean} center 是否使内容垂直居中（默认false）
 * @property {String} hover-class 是否开启点击反馈，none为无效果（默认true）
 * // @property {Boolean} border-gap border-bottom为true时，Cell列表中间的条目的下边框是否与左边有一个间隔（默认true）
 * @property {Boolean} arrow 是否显示右侧箭头（默认true）
 * @property {Boolean} required 箭头方向，可选值（默认right）
 * @property {Boolean} arrow-direction 是否显示左边表示必填的星号（默认false）
 * @property {Object} title-style 标题样式，对象形式
 * @property {Object} value-style 右侧内容样式，对象形式
 * @property {Object} label-style 标题下方描述信息的样式，对象形式
 * @property {String} bg-color 背景颜色（默认transparent）
 * @property {String Number} index 用于在click事件回调中返回，标识当前是第几个Item
 * @property {String Number} title-width 标题的宽度，单位rpx
 * @example <dz-cell-item icon="integral-fill" title="会员等级" value="新版本"></dz-cell-item>
 */
export default {
	name: 'dz-cell-item',
	props: {
		// 左侧图标名称(只能内置图标)，或者图标src
		icon: {
			type: String,
			default: ''
		},
		// 左侧标题
		title: {
			type: [String, Number],
			default: ''
		},
		// 右侧内容
		value: {
			type: [String, Number],
			default: ''
		},
		// 标题下方的描述信息
		label: {
			type: [String, Number],
			default: ''
		},
		// 是否显示下边框
		borderBottom: {
			type: Boolean,
			default: true
		},
		// 是否显示上边框
		borderTop: {
			type: Boolean,
			default: false
		},
		// 多个cell中，中间的cell显示下划线时，下划线是否给一个到左边的距离
		// 1.4.0版本废除此参数，默认边框由border-top和border-bottom提供，此参数会造成干扰
		// borderGap: {
		// 	type: Boolean,
		// 	default: true
		// },
		// 是否开启点击反馈，即点击时cell背景为灰色，none为无效果
		hoverClass: {
			type: String,
			default: 'dz-cell-hover'
		},
		// 是否显示右侧箭头
		arrow: {
			type: Boolean,
			default: true
		},
		// 内容是否垂直居中
		center: {
			type: Boolean,
			default: false
		},
		// 是否显示左边表示必填的星号
		required: {
			type: Boolean,
			default: false
		},
		// 标题的宽度，单位rpx
		titleWidth: {
			type: [Number, String],
			default: ''
		},
		// 右侧箭头方向，可选值：right|up|down，默认为right
		arrowDirection: {
			type: String,
			default: 'right'
		},
		// 控制标题的样式
		titleStyle: {
			type: Object,
			default() {
				return {};
			}
		},
		// 右侧显示内容的样式
		valueStyle: {
			type: Object,
			default() {
				return {};
			}
		},
		// 描述信息的样式
		labelStyle: {
			type: Object,
			default() {
				return {};
			}
		},
		// 背景颜色
		bgColor: {
			type: String,
			default: 'transparent'
		},
		// 用于识别被点击的是第几个cell
		index: {
			type: [String, Number],
			default: ''
		},
		// 是否使用lable插槽
		useLabelSlot: {
			type: Boolean,
			default: false
		},
		// 左边图标的大小，单位rpx，只对传入icon字段时有效
		iconSize: {
			type: [Number, String],
			default: 34
		},
		// 左边图标的样式，对象形式
		iconStyle: {
			type: Object,
			default() {
				return {}
			}
		},
		rightColor: {
			type: String,
			default: '#909399'
		},
		rightSize: {
			type: [Number, String],
			default: 34
		}
	},
	data() {
		return {

		};
	},
	computed: {
		arrowStyle() {
			let style = {};
			if (this.arrowDirection == 'up') style.transform = 'rotate(-90deg)';
			else if (this.arrowDirection == 'down') style.transform = 'rotate(90deg)';
			else style.transform = 'rotate(0deg)';
			return style;
		}
	},
	methods: {
		click() {
			this.$emit('click', this.index);
		}
	}
};
</script>

<style lang="scss" scoped>
@import "../../css/style.components.scss";
.dz-cell {
	@include vue-flex;
	align-items: center;
	position: relative;
	/* #ifndef APP-NVUE */
	box-sizing: border-box;
	/* #endif */
	width: 100%;
	padding: 26rpx 32rpx;
	font-size: 28rpx;
	line-height: 54rpx;
	color: $dz-content-color;
	background-color: #fff;
	text-align: left;
}

.dz-cell_title {
	font-size: 28rpx;
}

.dz-cell__left-icon-wrap {
	margin-right: 10rpx;
	font-size: 32rpx;
}

.dz-cell__right-icon-wrap {
	margin-left: 10rpx;
	color: #969799;
	font-size: 28rpx;
}

.dz-cell__left-icon-wrap,
.dz-cell__right-icon-wrap {
	@include vue-flex;
	align-items: center;
	height: 48rpx;
}

.dz-cell-border:after {
	position: absolute;
	/* #ifndef APP-NVUE */
	box-sizing: border-box;
	content: ' ';
	pointer-events: none;
	border-bottom: 1px solid $dz-border-color;
	/* #endif */
	right: 0;
	left: 0;
	top: 0;
	transform: scaleY(0.5);
}

.dz-cell-border {
	position: relative;
}

.dz-cell__label {
	margin-top: 6rpx;
	font-size: 26rpx;
	line-height: 36rpx;
	color: $dz-tips-color;
	/* #ifndef APP-NVUE */
	word-wrap: break-word;
	/* #endif */
}

.dz-cell__value {
	overflow: hidden;
	text-align: right;
	/* #ifndef APP-NVUE */
	vertical-align: middle;
	/* #endif */
	color: $dz-tips-color;
	font-size: 26rpx;
}

.dz-cell__title,
.dz-cell__value {
	flex: 1;
}

.dz-cell--required {
	/* #ifndef APP-NVUE */
	overflow: visible;
	/* #endif */
	@include vue-flex;
	align-items: center;
}

.dz-cell--required:before {
	position: absolute;
	/* #ifndef APP-PLUS */
	content: '*';
	/* #endif */
	left: 8px;
	margin-top: 4rpx;
	font-size: 14px;
	color: $dz-type-error;
}

.dz_cell_right {
	line-height: 1;
}
</style>
