<template>
	<view>
		<dz-navbar :title="'申请提现'"></dz-navbar>
		<view class="content">
			<dz-field label-width="200" label="支付宝账号" v-model="alipayAcc" placeholder="请输入支付宝账号" :border-bottom="true"></dz-field>
			<dz-field label-width="200" label="真实姓名" v-model="realname" placeholder="请输入真实姓名" :border-bottom="true"></dz-field>
			<dz-field label-width="200" label="提现金额" v-model="money" placeholder="请输入提现金额" :border-bottom="false"></dz-field>
		</view>
		<view class="tip" :style="{ color: theme.dzBaseColor }">
			<!-- <view>可提金额：{{ withdrawConfig.promoter && withdrawConfig.promoter.user_brokerage }}元</view>
			<view>起提金额：{{ withdrawConfig.commission_withdraw_lowest_money }}元</view>
			<view>单次可提：{{ parseFloat(withdrawConfig.commission_withdraw_highest_money) > 0 ? withdrawConfig.commission_withdraw_highest_money + '元' : '不限' }}</view> -->
			<view>{{tips}}</view>
		</view>
		<view class="dz-m-t-80 dz-flex dz-row-center">
			<view style="width: 90%;">
				<dz-button
					:custom-style="{
						background: submitting ? theme.dzBaseDisabled : theme.dzBaseColor,
						color: theme.dzBaseFontColor
					}"
					:border="false"
					hover-class="none"
					shape="circle"
					:disabled="submitting"
					@click="withdrawCreate"
				>
					立即提现
				</dz-button>
			</view>
		</view>
		<!-- <dz-page-loading :show="loadingShow" :status="loadingStatus" @click="loadingClick"></dz-page-loading> -->
		<dz-toast ref="dzToast"></dz-toast>
	</view>
</template>

<script>
export default {
	data() {
		return {
			theme: this.$api.theme,
			language: this.$api.language,
			withdrawConfig: {},
			withdrawData: null,
			alipayAcc: '',
			realname: '',
			money: '',
			loadingShow: true,
			loadingStatus: 'loading',
			submitting: false,
			tips: ''
		};
	},
	async onLoad() {
		uni.setNavigationBarTitle({
			title: '申请提现'
		});
		// uni.$on('getBankAccount', data => {
		// 	this.withdrawData = data;
		// });
		// uni.$on('updateBankAccount', data => {
		// 	this.getWithdrawConfig();
		// });
		await this.$onLaunched;
		this.getWithdrawConfig();
	},
	methods: {
		loadingClick() {
			this.getWithdrawConfig();
		},
		getWithdrawConfig() {
			this.$api.http
				.get(this.$api.apiConfig.withdrawTip)
				.then(res => {
					console.log("res: " + JSON.stringify(res));
					if (res.code == 200) {
						this.tips = res.msg;
					}
					this.loadingShow = false;
				})
				.catch(err => {
					console.error(err);
					this.loadingStatus = 'error';
				});
		},
		// 申请提现
		withdrawCreate() {
			if (this.submitting) {
				return;
			}
			this.money = parseFloat(this.money) || '';
			if (!this.alipayAcc) {
				this.$refs.dzToast.show({
					title: '请输入支付宝账号',
					type: 'warning'
				});
				return;
			}
			if (!this.realname) {
				this.$refs.dzToast.show({
					title: '请输入真实姓名',
					type: 'warning'
				});
				return;
			}
			if (!this.money) {
				this.$refs.dzToast.show({
					title: '请输入提现金额',
					type: 'warning'
				});
				this.money = '';
				return;
			}
			// if (this.money < parseFloat(this.withdrawConfig.commission_withdraw_lowest_money)) {
			// 	this.$refs.dzToast.show({
			// 		title: `至少提现：${this.withdrawConfig.commission_withdraw_lowest_money}元`,
			// 		type: 'warning'
			// 	});
			// 	return;
			// }
			// if (parseFloat(this.withdrawConfig.commission_withdraw_highest_money) > 0 && this.money > parseFloat(this.withdrawConfig.commission_withdraw_highest_money)) {
			// 	this.$refs.dzToast.show({
			// 		title: `单次只能提现：${this.withdrawConfig.commission_withdraw_highest_money}元`,
			// 		type: 'warning'
			// 	});
			// 	return;
			// }
			// if (this.money > parseFloat(this.withdrawConfig.promoter.user_brokerage)) {
			// 	this.$refs.dzToast.show({
			// 		title: '您的可提金额不够啊',
			// 		type: 'warning'
			// 	});
			// 	return;
			// }
			this.submitting = true;
			const params = {};
			params.alipayCount = this.alipayAcc;
			params.realname = this.realname;
			params.value = this.money;

			this.$api.http
				.post(this.$api.apiConfig.withdraw, params)
				.then(res => {
					if (res.code == 200) {
						this.$refs.dzToast.show({
							title: '提交成功,等待审核',
							type: 'success'
						});
						setTimeout(() => {
							this.$api.router.back()
						}, 1000);
					} else {
						this.$refs.dzToast.show({
							title: res.msg,
							type: 'error'
						});
					}
					this.submitting = false;
				})
				.catch(err => {
					this.submitting = false;
				});
		}
	}
};
</script>

<style lang="scss">
.content {
	// padding: 20rpx 0;
	background-color: #ffffff;
}
.tip {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 30rpx;
	font-size: 24rpx;
}
</style>
