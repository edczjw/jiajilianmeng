<template>
	<view>
		<dz-navbar :isBack="false" :borderBottom="false" :height="1" :background="{background: '#f6f0eb'}">
		</dz-navbar>
		<!-- navbar -->
		<!-- <dz-navbar-immersive splitLine :isCustom="true" @init="initNavigation" @change="opacityChange" scrollRatio="0.3"
			:scrollTop="scrollTop" :title="barTitle" backgroundColor="#fff" :color="theme.dzMainColor">
			<view class="dz-navbar-inner" :style="[navbarInnerStyle]">
				<view class="dz-navbar-content-title flex a-center j-center" :style="[titleStyle]">
					<view v-if="hasLogin" class="flex a-center j-center">
						<dz-avatar
							:src="helper.formatImg(userInfo.icon) || missingFace"
							:size="50"
							:is-border="true"
							:border-size="5"
							:border-color="'#fff'"
						></dz-avatar>
						<text class="dz-title dz-line-1 dz-font-weight">{{ userInfo.nick }}</text>
					</view>
					<view v-else class="dz-title dz-line-1">{{ barTitle }}</view>
				</view>
			</view>
		</dz-navbar-immersive> -->
		<view class="dz-relative">
			<view v-for="(item,index) in componentList" :key="index">
				<view v-if="item.component == 'dz-gap'">
					<dz-gap ref="dzGap" :height="parseInt(item.props.height) * 2" :bg-color="item.props.bgColor">
					</dz-gap>
				</view>
				<view v-if="item.component == 'wwj-my-head'" ref="profileHead"
					:style="{ width: '100%', overflow: 'hidden' }">
					<wwj-my-head :config="item" :userInfo="userInfo" :hasLogin="hasLogin" :signinToday="signinToday" :signinStatus="signinStatus" ref="myHeadRef" @click="toUserInfo(index, $event)">
					</wwj-my-head>
				</view>
				<!-- 我的统计菜单 -->
				<!-- <view v-if="item.component == 'wwj-statistics-menu' && hasLogin"
					:style="{ marginTop: `-${parseInt(item.props.pushTop) * 2}rpx` }">
					<wwj-my-statistics-menu :config="item" :userInfo="userInfo" :hasLogin="hasLogin" @click="clickStatisticsMenu(index, $event)">
					</wwj-my-statistics-menu>
				</view> -->
				
				<!-- 轮播图 -->
				<view v-if="item.component == 'dz-swiper' && carouselList && carouselList.length > 0" :style="{ marginTop: `-${parseInt(item.props.pushTop) * 2}rpx` }">
					<view :style="{ padding: `${parseInt(item.props.paddingTop) * 2}rpx ${parseInt(item.props.leftRight) * 2}rpx ${parseInt(item.props.paddingBottom) * 2}rpx` }">
						<u-swiper :list="carouselList" @click="bannerTab" keyName="img" height="220rpx"
							indicator indicatorMode="line" circular radius="20"
							duration="800" imgMode="scaleToFill" bgColor="#fff"></u-swiper>
						
						<!-- <dz-swiper
							name="cover"
							:list="item.props.list"
							:border-radius="parseInt(item.props.borderRadius) * 2"
							:mode="item.props.mode"
							:height="parseInt(item.props.height) * 2"
							:indicator-pos="item.props.indicatorPos"
							:effect3d="item.props.effect3d == 1 ? true : false"
							:title="item.props.title == 1 ? true : false"
							:bgColor="item.props.bgColor"
							@click="swiperClick(index, $event)"
						></dz-swiper> -->
					</view>
				</view>
				
				<!-- 我的订单 -->
				<!-- <view v-if="item.component == 'wwj-my-order'"
					:style="{ marginTop: `-${parseInt(item.props.pushTop) * 2}rpx` }">
					<wwj-my-order :config="item" :userInfo="userInfo" :hasLogin="hasLogin"></wwj-my-order>
				</view> -->
				
				<!-- 推广中心 -->
				<view v-if="item.component == 'wwj-distribution' && hasLogin && userInfo.proxyPerm == 1"
					:style="{ marginTop: `-${parseInt(item.props.pushTop) * 2}rpx` }"  @click="toDistribution">
					<wwj-distribution :config="item" :userInfo="userInfo" :userPromoter="userPromoter"></wwj-distribution>
				</view>
				<!-- 魔方 -->
				<!-- <view v-if="item.component == 'dz-rubiks-cube'">
					<wwj-rubiks-cube :radius="parseInt(item.props.radius) * 2"
						:clearance="parseInt(item.props.clearance) * 2" :list="item.props.list" :mode="item.props.mode"
						:left-right="parseInt(item.props.leftRight) * 2"
						:top-buttom="parseInt(item.props.topButtom) * 2" :heightConfig="item.props.heightConfig">
					</wwj-rubiks-cube>
				</view> -->
				<!-- 卡片菜单 -->
				<view class="card" v-if="item.component == 'dz-card'"
					:style="{ marginTop: `-${parseInt(item.props.pushTop) * 2}rpx` }">
					<wwj-card-menu :config="item" @click="cardMenuClick(index, $event)"></wwj-card-menu>
				</view>
			</view>
			<u-gap :height="180"></u-gap>
		</view>
		<!-- 页面加载 -->
		<dz-page-loading :show="pageLoadingShow" :status="pageLoadingStatus" zIndex="981" @click="pageLoadingClick">
		</dz-page-loading>
		
		<u-popup :show="addgroupQrcodeShow"  mode="center" :closeable="true" @close="addgroupQrcodeShow = false">
			<view style="width: 500rpx;height: 500rpx;margin-top: 50rpx;">
				<image src="https://oss.fstaolege.com/imgs/2022/5/16/44ea4ff9ee9a429cb8dbdca6ff4f298d.png" style="width: 500rpx;height: 500rpx;"></image>
			</view>
		</u-popup>
	</view>
</template>

<script>
	// 获取系统状态栏的高度
	let systemInfo = uni.getSystemInfoSync();
	let menuButtonInfo = {};
	// 如果是小程序，获取右上角胶囊的尺寸信息，避免导航栏右侧内容与胶囊重叠(支付宝小程序非本API，尚未兼容)
	// #ifdef MP-WEIXIN || MP-BAIDU || MP-TOUTIAO || MP-QQ
	menuButtonInfo = uni.getMenuButtonBoundingClientRect();
	// #endif
	import tabbarConfig from '@/core/config/tabbarConfig';
	import {
		mapState,
		mapGetters
	} from 'vuex';
	import profilePageConfig from './profilePageConfig';
	export default {
		data() {
			return {
				barTitle: '个人',
				theme: this.$api.theme,
				helper: this.$api.helper,
				defaultTabbarList: tabbarConfig.tabbarList,
				top: 0,
				opacity: 0,
				scrollTop: 0,
				isColor: true,
				titleWidth: 250,
				navbarIconColor: {
					notifyColor: '#fff',
					badegColor: '#fff',
					badegBgColor: '#fa3534'
				},
				pageLoadingShow: false,
				pageLoadingStatus: 'loading',
				componentList: [],
				signinToday: false,
				signinStatus: false,
				signinMode: [],
				carouselList: [],
				recommendDollList: [],
				allRecommendDollList: [],
				currentPageNum: 1,
				pageSize: 10,
				pageNum:0,
				missingFace: this.$api.assetsConfig.missingFace,
				showDollMachineList:false,
				multiMachineDoll:null,
				addgroupQrcodeShow:false,
				userPromoter: {
					countExtend: '',
					sumUnWithdraw: '',
					sumCommission: ''
				}
			}
		},
		async onLoad() {
			await this.$onLaunched;
			let pages = getCurrentPages();
			this.barTitle = this.$api.language.profile.titleProfile;
			uni.setNavigationBarTitle({
				title: this.barTitle
			});
			uni.$on('themeChange', () => {
				this.theme = this.$api.theme;
				this.getInfoData();
			});
			this.getProfileData();
		},
		onUnload() {
			uni.$off(['themeChange']);
		},
		computed: {
			...mapState(['tabbarList', 'userInfo', 'signinTime']),
			...mapGetters(['hasLogin']),
			// 导航栏内部盒子的样式
			navbarInnerStyle() {
				let style = {};
				// 导航栏宽度，如果在小程序下，导航栏宽度为胶囊的左边到屏幕左边的距离
				style.height = this.navbarHeight + 'px';
				// // 如果是各家小程序，导航栏内部的宽度需要减少右边胶囊的宽度
				// #ifdef MP
				let rightButtonWidth = systemInfo.windowWidth - menuButtonInfo.left;
				style.marginRight = rightButtonWidth + 'px';
				// #endif
				return style;
			},
			// 导航中间的标题的样式
			titleStyle() {
				let style = {};
				// #ifndef MP
				style.left = (systemInfo.windowWidth - uni.upx2px(this.titleWidth)) / 2 + 'px';
				style.right = (systemInfo.windowWidth - uni.upx2px(this.titleWidth)) / 2 + 'px';
				// #endif
				// #ifdef MP
				// 此处是为了让标题显示区域即使在小程序有右侧胶囊的情况下也能处于屏幕的中间，是通过绝对定位实现的
				let rightButtonWidth = systemInfo.windowWidth - menuButtonInfo.left;
				style.left = (systemInfo.windowWidth - uni.upx2px(this.titleWidth)) / 2 + 'px';
				style.right = rightButtonWidth - (systemInfo.windowWidth - uni.upx2px(this.titleWidth)) / 2 +
					rightButtonWidth + 'px';
				// #endif
				style.width = uni.upx2px(this.titleWidth) + 'px';
				style.opacity = this.opacity;
				return style;
			},
		},
		onReady() {
			//H5刷新后，scrollTop位置停留在上次位置，这时候没有触发onPageScroll事件，所以需要进行初始化
			// #ifdef H5
			if (this.$refs.profileHead) {
				let top = this.$refs.profileHead.$el.getBoundingClientRect().top;
				this.scrollTop = Math.abs(top);
			}
			// #endif
		},
		async onShow() {
			if(!this.hasLogin){
				return;
			}
			await this.$onLaunched;
			this.initData();
		},
		onPageScroll(e) {
			this.scrollTop = e.scrollTop;
		},
		onReachBottom(e) {
			if (this.pageLoadingStatus == 'nodata' || this.pageLoadingStatus == 'nomore') {
				return;
			}
			this.getRecomendDollDataList();
		},
		methods: {
			async initData() {
				await this.getUserInfo();
				this.getUserPromoter();
			},
			async getUserInfo() {
				this.$api.http.get(this.$api.apiConfig.getUserInfoUrl).then(res=>{
					console.log(res);
					this.$api.store.commit('setUserInfo',res.data);
				}).catch(err=>{
					console.error(err);
				});
			},
			initNavigation(e) {
				this.opacity = e.opacity;
				this.top = e.top;
			},
			opacityChange(e) {
				this.opacity = e.opacity;
				this.isColor = parseInt(this.opacity) == 1 ? false : true;
			},
			async getProfileData() {
				uni.$api.http.get(uni.$api.apiConfig.getBanner + "personalCenter").then(res => {
					console.log(res);
					if(res.data && res.data.personalCenter){
						this.carouselList = res.data.personalCenter;
						this.carouselList.forEach((item, index) => {
							this.$set(item, "img", uni.$api.helper.formatImg(item.img));
						});
					}else {
						this.carouselList = [];
					}
				}).catch(err=>{
					console.log(err);
				});
				
				this.pageLoadingShow = true;
				this.componentList = profilePageConfig.component;
				await this.getRecomendDollDataList();
				this.pageLoadingShow = false;
			},
			async getRecomendDollDataList(){
				this.pageLoadingStatus = 'loading';
				if(this.allRecommendDollList.length > 0){
					if(this.currentPageNum > this.pageNum){
						this.pageLoadingStatus = 'nomore';
					}else{
						let pageData = this.allRecommendDollList.slice(this.currentPageNum*this.pageSize,(this.currentPageNum+1)*this.pageSize);
						this.recommendDollList.push(...pageData);
						this.currentPageNum++;
					}
				}else{
					await this.$api.http.get(this.$api.apiConfig.getDollList, {
						page:this.currentPageNum,
						categoryId:0,
						pageSize:20
					}).then(res => {
						if(res && res.data && res.data.length > 0){
							this.allRecommendDollList = res.data;
							this.pageNum = Math.ceil(this.allRecommendDollList/this.pageSize) || 1;
							this.recommendDollList = [];
							this.currentPageNum = 0;
							let pageData = this.allRecommendDollList.slice(this.currentPageNum*this.pageSize,(this.currentPageNum+1)*this.pageSize);
							this.recommendDollList.push(...pageData);
							this.currentPageNum++;
						}else{
							this.pageLoadingStatus = 'nodata';
						}
					}).catch(err => {
						console.error(err)
					})
				}
			},
			toDistribution(){
				this.$api.router.push({
					route: this.$api.pagesConfig['distribution']
				});
			},
			toUserInfo(index, url){
				let item = this.componentList[index].props.list[0];
				this.$api.wwj.urlJump(item);
			},
			clickStatisticsMenu(index, item){
				this.$api.wwj.urlJump(item);
			},
			cardMenuClick(index, itemIndex){
				let item = this.componentList[index].props.list[itemIndex];
				// 客服
				if (item.method) {
					if (item.method == 'customerService'){
						this.serviceTap();
					} else if (item.method == 'order'){
						this.$api.wwj.urlJump(item);
					} else if(item.method == 'addgroup'){
						this.addgroup();
						return;
					}else if(item.method == 'jifenExchangeCoin'){
						this.jifenExchangeCoin();
						return;
					}
				} else {
					this.$api.router.push({
						route: this.$api.pagesConfig[item.key]
					});
				}
			},
			serviceTap() {
				this.$api.http.get(this.$api.apiConfig.getOnlineCustomerUrl).then(res=>{
					if(res.onlineCustomer){
						this.$api.router.push({
							route: this.$api.pagesConfig.webview,
							query: {
								url: this.helper.strEncode(res.onlineCustomer)
							}
						});
					}else {
						this.helper.toast("暂未配置客服");
					}
				}).catch(error=>{
					console.error(error)
				});
			},
			addgroup() {
				this.addgroupQrcodeShow = true;
			},
			jifenExchangeCoin(){
				this.helper.toast("您还没有可用积分~");
			},
			pageLoadingClick(){
				
			},
			popMachineList(item){
				this.showDollMachineList = true;
				this.multiMachineDoll = item;
				console.log("popDollMachineList");
			},
			closeDollMachineList(){
				this.showDollMachineList = false;
			},
			randomGoGame(){
				let allMachineIds = [];
				this.allRecommendDollList.forEach((item,index)=>{
					allMachineIds.push(...item.machineIds);
				});
				if(allMachineIds.length == 0){
					return;
				}
				let index = Math.floor(Math.random() * allMachineIds.length + 1)-1; 
				let machineId = allMachineIds[index];
				let data = {machineId: machineId,video:null}
				uni.$api.router.push({
					route:uni.$api.pagesConfig.game,
					query:{
						machine:encodeURIComponent(JSON.stringify(data))
					}
				});
			},
			getUserPromoter() {
				/* this.$api.http.get(this.$api.apiConfig.extendInfo).then(res=>{
					console.log("res: " + JSON.stringify(res));
					this.userPromoter.countExtend = res.data.countExtend;
					this.userPromoter.sumCommission = res.data.sumCommission;
					this.userPromoter.sumUnWithdraw = res.data.sumUnWithdraw;
				}).catch(error=>{
					console.error(error);
				}); */
			},
			// 轮播图
			swiperClick(index, itemIndex) {
				const item = this.componentList[index].props.list[itemIndex];
				this.$api.wwj.urlJump(item);
			},
			bannerTab(index) {
				console.log("====================bannerTab  index="+index);
				let item = this.carouselList[index];
				console.log(item);
				if(item.jumpType == 'outLink'){
					// #ifdef APP-PLUS
					plus.runtime.openURL(item.jumpLink, function(res) {});
					// #endif
				}else if(item.jumpType == 'innerPage'){
					uni.$api.router.push({
						route: uni.$api.pagesConfig[item.jumpLink],
						query: {}
					});
				}else if(item.jumpType == 'innerWebview'){
					uni.navigateTo({
						url : "/pages/public/webview?url=" + encodeURIComponent(item.jumpLink),
					})
				}else if(item.jumpType == 'article'){
					uni.navigateTo({
						url : "/pages/public/article?id=" + item.jumpLink,
					})
				}
			},
		}
	}
</script>

<style lang="scss" scoped>
	.dz-navbar-inner {
		height: 44px;
		display: flex;
		justify-content: space-between;
		position: relative;
		align-items: center;
	}

	.dz-navbar-content-title {
		display: flex;
		align-items: center;
		justify-content: center;
		flex: 1;
		position: absolute;
		left: 0;
		right: 0;
		height: 60rpx;
		text-align: center;
		flex-shrink: 0;
	}

	.dz-title {
		line-height: 60rpx;
		font-size: 32rpx;
		flex: 1;
		color: $dz-main-color;
	}

	.dz-navbar-right {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: flex-end;
	}

	.right-item {
		margin: 0 32rpx;
		position: relative;
		color: $dz-main-color;
		display: flex;
	}

	// 积分签到弹窗
	.popup-box {
		padding: 40rpx;
		text-align: center;

		.title {
			margin-top: 20rpx;
			color: $dz-main-color;
			font-size: 36rpx;
		}

		.tip {
			font-size: 24rpx;
			color: $dz-tips-color;
		}
	}
	
	.card {
		// margin-bottom: 100rpx;
	}
</style>
