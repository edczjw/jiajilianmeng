<template>
	<view class="bg-white">
		<dz-navbar :isBack="false" :title="barTitle" :titleBold="true" :titleSize="36" :borderBottom="false">
		</dz-navbar>
		<dz-gap :height="20"></dz-gap>
		<view class="">
			<wwj-scroll-body class="goodlist" @init="mescrollInit" @down="downCallback" @up="upCallback">
				<view elevation="20rpx" class="p-2 bg-white mx-2 box-shadow-card" style="border-radius: 20rpx;">
					<u-swiper v-if="carouselList && carouselList.length > 0" :list="carouselList" @click="" keyName="img" height="250rpx"
						indicator indicatorMode="line" circular radius="20"
						duration="800" imgMode="scaleToFill" bgColor="#fff"></u-swiper>
					<!-- <image src="../../static/market/bartitle.jpg" style="height: 250rpx;border-radius: 20rpx;" mode=""></image> -->
					<view class="flex flex-row j-sb mt-2">
						<view class="flex flex-row j-center a-center">
							<u-avatar :src="utils.formatImg(userInfo.icon) || missingFace" size="80"></u-avatar>
							<view class="flex flex-column ml-2">
								<view class="">
									<text class="font-md">我的积分:</text>
									<text class="font-md font-weight">{{ userInfo.jifen || 0 }}</text>
								</view>
								<!-- <view class="">
									<text class="font-smd" :style="{color:theme.dzLightColor}">如何获得积分？</text>
								</view> -->
							</view>
						</view>
						<view class="flex flex-row j-center a-center" @tap="toDetails">
							<text>积分明细</text>
							<u-icon name="arrow-right"></u-icon>
						</view>
					</view>
				</view>
				<dz-gap :height="20"></dz-gap>
				<view>
					<u-sticky bgColor="#fff" :customNavHeight="$api.helper.px2rpx(this.navbarHeight+44)">
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
					<view class="productList mt-1" >
						<!-- <dz-gap :height="20"></dz-gap> -->
						<wwj-product-list :list="productList" :theme="theme" @clickItem="clickItem"
							:radius="20"
							:left-right="24">
						</wwj-product-list>
						<u-loadmore :fontSize="28" :status="uploadstatus" loadmoreText="上拉加载更多" loadingText="加载中..." nomoreText="没有更多了" :line="true">
						</u-loadmore>
						<u-gap :height="180"></u-gap>
						<dz-empty text="还没有可兑换的产品呢~" v-if="productList.length==0 && uploadstatus != 'loading'"></dz-empty>
					</view>
				</view>
			</wwj-scroll-body>
		</view>
	</view>
	
</template>

<script>
	import MescrollMixin from "@/core/components/mescroll-uni/mescroll-mixins.js";
	// 获取系统状态栏的高度
	let systemInfo = uni.getSystemInfoSync();
	import {mapState,mapGetters} from 'vuex';
	export default {
		mixins: [MescrollMixin], // 使用mixin
		data(){
			return{
				barTitle:"积分商城",
				theme:this.$api.theme,
				scrollTop: 0,
				titleWidth: 250,
				opacity: 0,
				navbarHeight:0,
				lineBg:this.$api.assetsConfig.tabindicator,
				categoryTabs:[],
				tabCurrentIndex:0,
				carouselList: [],
				currentTabItem:null,
				productList:[],
				utils:uni.$api.helper,
				missingFace: this.$api.assetsConfig.missingFace,
				uploadstatus:'loading',
				listHeight:1500,
			}
		},
		computed: {
			...mapState(['userInfo']),
		},
		async onLoad(){
			this.navbarHeight = systemInfo.statusBarHeight;
			// this.listHeight = this.utils.px2rpx(systemInfo.windowHeight - this.navbarHeight-44);
		},
		methods:{
			//进入页面调一次
			async downCallback(){
				await uni.$api.http.get(uni.$api.apiConfig.getBanner + "pointsmarketTop").then(res => {
					if(res.data && res.data.pointsmarketTop){
						this.carouselList = res.data.pointsmarketTop;
						this.carouselList.forEach((item, index) => {
							this.$set(item, "img", uni.$api.helper.formatImg(item.img));
						});
					}else {
						this.carouselList = [];
					}
				}).catch(err=>{
					console.log(err);
				});
				
				this.$api.http.get(this.$api.apiConfig.productCategory).then(res=>{
					this.categoryTabs = res.data;
					this.categoryTabs.splice(0, 0, {
						id: 0,
						name: '全部'
					})
					if(this.$api.helper.isEmpty(this.currentTabItem)){
						this.currentTabItem = this.categoryTabs[0]
					}
					this.mescroll.resetUpScroll();
				}).catch(err=>{
					console.log(err)
					this.mescroll.endSuccess(0);
				});
			},
			//进入页面调一次，下拉到底部触发
			upCallback(page){
				console.log(page);
				if(this.$api.helper.isEmpty(this.categoryTabs) || this.$api.helper.isEmpty(this.currentTabItem)){
					this.mescroll.endSuccess(0);
					return;
				}
				this.uploadstatus = 'loading';
				this.$api.http.get(this.$api.apiConfig.productList,
				{
					page:page.num,
					categoryId:this.currentTabItem.id
				}).then(res=>{
					if(res.data && res.data.length > 0){
						if(page.num == 1){
							this.productList=[];
						}
						this.productList.push(...res.data);
						this.uploadstatus = 'loadmore';
					}
					if(res.data.length < page.size){
						this.uploadstatus = "nomore";
					}
					this.mescroll.endSuccess(res.data.length);
				}).catch(err=>{
					console.log(err);
				})
			},
			clickItem(data){
				this.$api.router.push({
					route: this.$api.pagesConfig["productDetail"],
					query: {productId: data.id}
				});
			},
			tabChange(item){
				if (this.tabCurrentIndex == item.index) return;
				this.tabCurrentIndex = item.index;
				this.currentTabItem = item;
				this.productList=[];
				this.mescroll.resetUpScroll();
			},
			toDetails(){
				if (!this.$api.store.getters.hasLogin) {
					return;
				}
				this.$api.router.push({
					route: this.$api.pagesConfig["integral"],
					query: {}
				});
			}
		}
	}
</script>

<style scoped>
	.goodlist{
		/* background-color: #f8fafc; */
	}
	
	.productList {
		/* background-color: #f8f8f8; */
	}
	
	.box-shadow-card{
		box-shadow: 0rpx 0rpx 30rpx rgba(0, 0, 0, 0.2);
	}
</style>
