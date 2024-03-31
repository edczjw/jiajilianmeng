<template>
	<view class="bg-white">
		<dz-navbar title='娃娃背包' :border-bottom="false"></dz-navbar>
		<view class="">
			<u-sticky bgColor="#fff" >
				<u-tabs
					:current="tabCurrentIndex"
					@change="tabChange"
				    :list="categoryTabs"
				    lineWidth="50"
				    lineHeight="10"
				    lineColor="#f56c6c"
				    :activeStyle="{
					   color: '#303133',
					   fontWeight: 'bold',
					   transform: 'scale(1.05)'
				    }"
				    :inactiveStyle="{
					   color: '#606266',
					   transform: 'scale(1)'
				    }"
				    itemStyle="padding-left: 15px; padding-right: 15px; height: 34px;"
				    >
				    </u-tabs>
			</u-sticky>
			<wwj-scroll-body @init="mescrollInit" @down="downCallback" @up="upCallback">
				<view>
					<view class="dollList mt-1" >
						<wwj-mydoll-list ref="mydollList" :list="dollList" :theme="theme" @showCount="showCount"
							:radius="20"
							:left-right="24">
						</wwj-mydoll-list>
						<u-loadmore v-show="dollList.length > 0 || uploadstatus == 'loading'" :fontSize="28" :status="uploadstatus" loadmoreText="上拉加载更多" loadingText="加载中..." nomoreText="没有更多了" :line="true">
						</u-loadmore>
						<u-gap :height="240"></u-gap>
						<dz-empty text="还没有娃娃呢,快去抓取吧~" v-if="dollList.length==0 && uploadstatus != 'loading'"></dz-empty>
					</view>
				</view>
			</wwj-scroll-body>
		</view>
		
		<view v-if="selectCount > 0 && tabCurrentIndex == 0 " class="position-fixed bg-white text-center dz-font-weight" style="bottom: 160rpx;width: 100%;height: 60rpx;color: gray">已选{{selectCount}}个,可兑换{{selectJifenSum}}积分</view>
		
		<!--底部操作栏-->
		<view v-if="tabCurrentIndex == 0 && dollList.length > 0" class="dz-operation-ios">
			<view class="dz-operation">
				<view class="dz-flex-1">
					<view class="flex flex-row j-center a-center m-3">
						<u-button type="warning" shape="circle" text="兑换积分" @tap="exchange"></u-button>
						<u-button class="ml-5" type="success" shape="circle" text="申请发货" @tap="showAddressModal"></u-button>
					</view>
				</view>
			</view>
		</view>
		
		<u-modal :show="addressShow" :showCancelButton="true" title="确认申请发货?" @cancel="addressShow = false" @confirm="applyDeliver">
			<view class="slot-content">
				<view class="dz-address-section" @tap="choiceAddress">
					<view class="order-content">
						<view v-if="!helper.isEmpty(addressData)" class="address">
							<view class="top">
								<text class="name">{{ addressData.realname }}</text>
								<text class="mobile">{{ helper.maskCode(addressData.phone, 3, 4) }}</text>
							</view>
							<text class="address dz-inline-1">{{ addressData.addressName }} {{ addressData.addressDetails }}</text>
							<text class="address dz-inline-1 dz-text-underline">(修改地址)</text>
						</view>
						<u-button v-else type="warning" text="请选择收货地址"></u-button>
						
						<view v-if="showShipping" class="mt-2 font-smd" style="color: red;">2件起包邮,单件需支付150金币邮费</view>
						<view v-else-if="!helper.isEmpty(addressData)" class="flex mt-2" style="color: green;">包邮</view>
					</view>
				</view>
			</view>
		</u-modal>
	</view>
	
</template>

<script>
	import MescrollMixin from "@/core/components/mescroll-uni/mescroll-mixins.js";
	// 获取系统状态栏的高度
	import {mapState,mapGetters} from 'vuex';
	export default {
		mixins: [MescrollMixin], // 使用mixin
		data(){
			return{
				helper: this.$api.helper,
				language: this.$api.language,
				theme:this.$api.theme,
				addressShow: false,
				showShipping: false,
				categoryTabs:[{
						id: 1,
						name: '寄存中'
					},
					{
						id: 3,
						name: '待发货'
					},
					{
						id: 4,
						name: '已发货'
					},
					{
						id: 5,
						name: '已完成'
					},
					{
						id: 2,
						name: '已兑换'
					}
					
				],
				tabCurrentIndex:0,
				currentTabItem:null,
				dollList:[],
				uploadstatus:'loading',
				addressData: {},
				selectCount: 0,
				selectJifenSum: 0
			}
		},
		computed: {
			...mapState(['userInfo']),
		},
		async onLoad(){
			uni.$on('getAddressData', data => {
				this.addressData = data;
			});
		},
		methods:{
			//进入页面调一次
			async downCallback(){
				if(this.$api.helper.isEmpty(this.currentTabItem)){
					this.currentTabItem = this.categoryTabs[0];
				}
				
				this.mescroll.resetUpScroll();
			},
			//进入页面调一次，下拉到底部触发
			upCallback(page){
				if(this.$api.helper.isEmpty(this.categoryTabs) || this.$api.helper.isEmpty(this.currentTabItem)){
					this.mescroll.endSuccess(0);
					return;
				}
				this.uploadstatus = 'loading';
				this.$api.http.get(this.$api.apiConfig.myDollList,
				{
					page:page.num,
					status:this.currentTabItem.id
				}).then(res=>{
					
					if(res.data && res.data.length > 0){
						if(page.num == 1){
							this.dollList=[];
							this.$refs.mydollList.removeSelectIds();
							this.selectCount = 0;
							this.selectJifenSum = 0;
						}
						this.dollList.push(...res.data);
						this.uploadstatus = 'loadmore';
					}
					if(res.data.length < page.size){
						this.uploadstatus = "nomore";
					}
					this.mescroll.endSuccess(res.data.length);
				}).catch(err=>{
					console.log(err);
					this.mescroll.endErr();
				})
			},
			tabChange(item){
				if(this.tabCurrentIndex == item.index) return;
				this.tabCurrentIndex = item.index;
				this.currentTabItem = item;
				this.dollList=[];
				this.mescroll.resetUpScroll();
			},
			// 兑换积分
			exchange:function(){
				let self = this;
				
				let selectIds = this.$refs.mydollList.selectIds || [];
				
				if(selectIds.length == 0){
					this.helper.toast("请选择要兑换的娃娃");
					return;
				}
				
				uni.showModal({
				    title: '提示',
				    content: '确认兑换积分?',
				    success: function (res) {
				        if (res.confirm) {
							uni.showLoading({title:'正在兑换...'});
							
							self.$api.http.get(self.$api.apiConfig.exchangeJifen,
							{
								ids: selectIds.join(",")
							}).then(res=>{
								this.helper.toast("兑换成功");
								uni.hideLoading();
								self.mescroll.resetUpScroll();
							}).catch(err=>{
								console.log(err);
								uni.hideLoading();
							})
							
							setTimeout(function () {
							    uni.hideLoading();
							}, 2000);
				        } else if (res.cancel) {
				        }
				    }
				});
			},
			showAddressModal() {
				let self = this;
				
				let selectIds = this.$refs.mydollList.selectIds || [];
				
				if(selectIds.length == 0){
					this.helper.toast("请先选择娃娃");
					return;
				}
				
				this.showShipping = selectIds.length < 2;
				
				this.addressShow = true;
			},
			// 申请发货
			applyDeliver:function(){
				if(this.helper.isEmpty(this.addressData)){
					this.helper.toast("请选择收货地址");
					return;
				}
				
				uni.showLoading({title:'正在提交...'});
				
				let selectIds = this.$refs.mydollList.selectIds || [];
				
				this.$api.http.get(this.$api.apiConfig.applyDeliver,
				{
					ids: selectIds.join(","),
					addressId:this.addressData.id
				}).then(res=>{
					this.addressShow = false;
					this.helper.toast("申请成功");
					uni.hideLoading();
					this.mescroll.resetUpScroll();
				}).catch(err=>{
					console.log(err);
					uni.hideLoading();
				})
				
				setTimeout(function () {
				    uni.hideLoading();
				}, 2000);
			},
			choiceAddress() {
				this.$api.router.push({
					route: this.$api.pagesConfig.address,
					query: {
						source: 'orderCreate'
					}
				});
			},
			showCount(data) {
				this.selectCount = data.length;
				
				let selectJifenSum = 0;
				
				this.dollList.forEach((item,index) => {
					if(data.indexOf(item.id) != -1){
						selectJifenSum += Number(item.exchangeJifen);
					}
				})
				
				this.selectJifenSum = selectJifenSum;
			}
		}
	}
</script>

<style scoped>
	.dz-address-section {
		padding: 30rpx;
		background: #fff;
		position: relative;
		border-radius: 10rpx;
		margin-bottom: 20rpx;
	
		.order-content {
			display: flex;
			align-items: center;
			justify-content: center;
		}
	
		.no-default-address {
			color: $dz-main-color;
			font-size: 36rpx;
		}
	
		.dzicon-right {
			color: $dz-tips-color;
		}
	
		.address {
			display: flex;
			flex-direction: column;
			flex: 1;
			font-size: 28rpx;
			color: $dz-main-color;
		}
	
		.name {
			font-size: 34rpx;
			margin-right: 24rpx;
		}
	
		.mobile {
			font-size: 34rpx;
		}
	
		.address {
			font-size: 24rpx;
			margin-top: 16rpx;
			margin-right: 20rpx;
			color: $dz-main-color;
		}
	
		.address-bg-img {
			position: absolute;
			width: 100%;
			height: 8rpx;
			left: 0;
			bottom: 0;
			background: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAL0AAAAECAMAAADszM6/AAAAOVBMVEUAAAAVqfH/fp//vWH/vWEVqfH/fp8VqfH/fp//vWEVqfH/fp8VqfH/fp//vWH/vWEVqfH/fp//vWHpE7b6AAAAEHRSTlMA6urqqlVVFRUVq6upqVZUDT4vVAAAAEZJREFUKM/t0CcOACAQRFF6r3v/w6IQJGwyDsPT882IQzQE0E3chToByjG5LwMgLZN3TQATmdypCciBya0cgOT3/h//9PgF49kd+6lTSIIAAAAASUVORK5CYII=')
				repeat;
		}
	}
	
	.dz-operation-ios {
		width: 100%;
		position: fixed;
		z-index: 10;
		bottom: 0;
		left: 0;
		background: rgba(255, 255, 255, 0.98);
	}
	
	.dz-operation {
		width: 100%;
		height: 100rpx;
		background: rgba(255, 255, 255, 0.98);
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: env(safe-area-inset-bottom);
	}
</style>
