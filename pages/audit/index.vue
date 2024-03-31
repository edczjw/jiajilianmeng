<template>
	<view class="content bgcolor">
		<view class="custom-page bgcolor">
			<!-- 页面背景图-->
			<view  class="custom-bg-img">
				<image :src="indexConfig.backgroundPicture"
					:style="{ width: '100%', height: indexConfig.isHeight == 0 ? parseInt(indexConfig.pictureHeight) * 2 + 'rpx' : parseInt(indexConfig.pictureHeight) + 'px' }">
				</image>
			</view>

			<view style="z-index: 9999;" class="bgcolor">
				<!-- navbar -->
				<view v-for="(item,index) in indexComponents" :key="index" :id="item.component">
					<view v-if="item.component == 'dz-gap'">
						<dz-gap ref="dzGap" :height="parseInt(item.props.height) * 2" :bg-color="item.props.bgColor"></dz-gap>
					</view>
					<!--自定义顶部-->
					<view v-if="item.component == 'dz-head'" ref="profileHead">
						<!-- #ifndef MP-TOUTIAO -->
						<dz-navbar :is-fixed="true" :is-back="false" input-align="center" :borderBottom="false"
							:background="{ background: '#d3ffff' }">
							<view slot="left" :style="{
									marginLeft:'10rpx',
									width: '100%',
									padding: `${parseInt(item.props.topBottom) * 2}rpx ${parseInt(item.props.leftRight) * 1}rpx`
								}" class="dz-flex">
								<view v-if="item.props.isDiy == 1 && item.props.isLeft == 1" class="dz-m-r-20">
									<view v-if="item.props.leftType == 1" :style="{
											fontSize: `${item.props.leftStyle.fontSize}px`,
											color: item.props.leftStyle.color,
											fontWeight: item.props.leftStyle.isBold == 1 ? 'bold' : '500'
										}">
										{{ item.props.leftText }}
									</view>
									<view v-if="item.props.leftType == 2">
										<!-- <dz-image :src="'https://oss.fszhuazhuale.com/oss/dolllogo.png'" :height="'70rpx'"
											:width="'70rpx'"
											:borderRadius="'20rpx'"></dz-image> -->
											<dz-image :src="'/static/icon/message.png'" :height="'50rpx'"
												:width="'50rpx'"
												:borderRadius="'20rpx'" @tap="messageTap()"></dz-image>
										<!-- <dz-image :src="'https://oss.fszhuazhuale.com/oss/dolllogo.png'" :height="parseInt(item.props.coverHeight)+ 'rpx'"
											:width="parseInt(item.props.coverWidth) + 'rpx'"
											:borderRadius="parseInt(item.props.borderRadius) * 2"></dz-image> -->
									</view>
								</view>
								<!-- <dz-search class="dz-flex-1" :disabled="true" :shape="item.props.shape"
									:value="item.props.value" :input-align="item.props.inputAlign"
									:bg-color="item.props.bgColor"
									:show-action="item.props.showAction == 1 ? true : false"
									@tap="searchTap(item.props.value)"></dz-search> -->
							</view>
							<view slot="right" v-if="item.props.isDiy == 1 && item.props.isRight == 1" class="dz-m-l-20">
								<!-- <dz-tag mode="plain" type="info" shape="circleLeft" :size="'25'"> -->
									<!-- <text style="border-width: 4rpx;background-color: #ff6f9a;color: white; border-radius: 25rpx;padding: 10rpx;border-color: blue;margin-right: 20rpx;"
									@tap="messageTap()">消息中心</text> -->
									<text style="border-width: 4rpx;background-color: #ff6f9a;color: white; border-radius: 25rpx;padding: 10rpx;border-color: blue;margin-right: 20rpx;"
									@tap="serviceTap()">客服中心</text>
										<!-- <dz-icon :name="$api.assetsConfig.coin" :size="'35'"></dz-icon> -->
										<!-- <text class="dz-font-weight" :style="{ color: theme.dzMainColor,fontSize:'20px',marginLeft:'5rpx'}">
											{{userInfo.coin || 0}}
										</text>
										<text class="my-coin-unit" :style="{ color: theme.dzMainColor,marginRight:'20rpx' }">
											币
										</text> -->
								<!-- </dz-tag> -->
							</view>
						</dz-navbar>
						<!-- #endif -->
					</view>
					<view v-if="item.component == 'wwj-loading'">
						<wwj-loading v-if="pullDownLoadingShow" :mode="styleLoadingType" :color="$api.theme.dzBaseColor"
							size="70"></wwj-loading>
					</view>
					<view v-if="item.component == 'dz-search'">
						<view :style="{
								width: '100%',
								padding: `${parseInt(item.props.topBottom) * 2}rpx ${parseInt(item.props.leftRight) * 2}rpx`
							}" class="dz-flex">
						<dz-search class="dz-flex-1" :disabled="true" :shape="item.props.shape"
							:value="item.props.value" :input-align="item.props.inputAlign"
							:bg-color="item.props.bgColor"
							:show-action="item.props.showAction == 1 ? true : false"
							@tap="searchTap(item.props.value)">
						</dz-search>
						</view>
					</view>
					<!-- 公告 -->
					<view v-if="item.component == 'dz-notice-bar'" :style="{
							margin: `${parseInt(item.props.topBottom) * 2}rpx ${parseInt(item.props.leftRight) * 2}rpx`
						}" @tap="messageTap()">
						<dz-notice-bar :list="notifyAnnounce" :mode="item.props.mode" :bg-color="item.props.bgColor"
							duration="5000" :volumeIcon="item.props.volumeIcon"
							:moreIcon="item.props.moreIcon == 1 ? true : false" :title="item.props.title"
							:title-style="item.props.titleStyle" :cover="item.props.cover"
							:widthHeight="parseInt(item.props.coverSize) * 2" :iconColor="item.props.iconColor"
							:color="item.props.color" :borderRadius="parseInt(item.props.radius) * 2"
							@click="noticeClick" @getMore="noticeClick"></dz-notice-bar>
					</view>
					<!-- 轮播图 -->
					<view v-if="item.component == 'dz-swiper' && $api.helper.isEmpty(item.props.list) == false" :style="{
							margin: `${item.props.topBottom}px ${item.props.leftRight}px`
						}">
						<dz-swiper name="img" :list="item.props.list"
							:border-radius="parseInt(item.props.borderRadius) * 2" :mode="item.props.mode"
							:height="parseInt(item.props.height) * 2" :indicator-pos="item.props.indicatorPos"
							:effect3d="item.props.effect3d == 1 ? true : false"
							:title="item.props.title == 1 ? true : false" :bgColor="item.props.bgColor"
							@click="swiperClick(index, $event)"></dz-swiper>
					</view>
					<!-- 魔方 -->
					<view v-if="item.component == 'dz-rubiks-cube'">
						<wwj-rubiks-cube :radius="parseInt(item.props.radius) * 2"
							:clearance="parseInt(item.props.clearance) * 2" :list="item.props.list"
							:mode="item.props.mode" :left-right="parseInt(item.props.leftRight) * 2"
							:top-buttom="parseInt(item.props.topButtom) * 2" :heightConfig="item.props.heightConfig"
							@click="rubiksCube"></wwj-rubiks-cube>
					</view>
					<!-- 分类 -->
					<!-- <view v-if="item.component == 'dz-grid-menu'">
						<dz-grid-menu :list="item.props.list" name="cover" title="cate_title" :col="item.props.col"
							:isPage="item.props.isPage == 1 ? true : false"
							:is-name="item.props.isName == 1 ? true : false"
							:width-height="parseInt(item.props.widthHeight) * 2"
							:border-radius="parseInt(item.props.borderRadius) * 2"
							:radius="parseInt(item.props.radius) * 2" :bgColor="item.props.bgColor"
							:left-right="parseInt(item.props.leftRight) * 2"
							:top-bottom="parseInt(item.props.topBottom) * 2" :border="false"
							:dot-color="item.props.dotColor" :mode="item.props.mode" :colNum="item.props.colNum"
							@click="gridAdvClick(index, $event)"></dz-grid-menu>
					</view> -->

					<!-- 图片广告 -->
					<view v-if="item.component == 'dz-banner' && $api.helper.isEmpty(item.props) == false" class="dz-relative" :style="{
							overflow: 'hidden',
							height: parseInt(item.height) * 2 + 'rpx',
							margin: `${parseInt(item.topBottom) * 2}rpx ${parseInt(item.leftRight) * 2}rpx`
						}">
						<dz-image :src="$api.helper.formatImg(item.props.cover)" :borderRadius="parseInt(item.radius) * 2"
							:height="parseInt(item.height) * 2" @click="banner(item.props)"></dz-image>
					</view>

					<!-- 标题 -->
					<view v-if="item.component == 'dz-title'">
						<dz-title :title="item.props.title" :mode="item.props.mode" :bar-color="item.props.barColor"
							:bar-bokeh-color="item.props.barBokehColor" :nameLeft="item.props.coverLeft"
							:nameRight="item.props.coverRight" :font-size="parseInt(item.props.fontSize) * 2"
							:barWidth="parseInt(item.props.barWidth) * 2"
							:barHeight="parseInt(item.props.barHeight) * 2" :title-color="item.props.titleColor"
							:tip-config="item.props.tipConfig" :icon-width="parseInt(item.props.iconWidth) * 2"
							:icon-height="parseInt(item.props.iconHeight) * 2" :text-align="item.props.textAlign"
							:bold="item.props.bold == 1 ? true : false"></dz-title>
					</view>
					
					<!-- 标题导航 -->
					<view
						v-if="item.component == 'dz-section'"
						@click="sectionClick(item.props.link)"
						:style="{
							margin: `${parseInt(item.props.topBottom) * 2}rpx ${parseInt(item.props.leftRight) * 2}rpx`
						}"
					>
						<dz-section
							:title="item.props.title"
							:arrow="item.props.right == 1 ? true : false"
							:right="item.props.right == 1 ? true : false"
							:showLine="item.props.showLine == 1 ? true : false"
							:line-color="item.props.lineColor"
							:bg-color="item.props.bgColor"
							:bold="item.props.bold == 1 ? true : false"
						></dz-section>
					</view>
					
					<!-- 文章列表 -->
					<view v-if="item.component == 'dz-article'">
						<dz-article
							:list="item.data"
							:mode="item.props.mode"
							:defaultList="item.props.list"
							:data-source="item.props.dataSource"
							:top-bottom="parseInt(item.props.topBottom) * 2"
							:left-right="parseInt(item.props.leftRight) * 2"
							:card-margin="parseInt(item.props.cardMargin) * 2"
							:card-padding="parseInt(item.props.cardPadding) * 2"
							:content-padding="parseInt(item.props.contentPadding) * 2"
							:radius="parseInt(item.props.radius) * 2"
							:radius1="parseInt(item.props.radius1) * 2"
							:radius2="parseInt(item.props.radius2) * 2"
							:width="parseInt(item.props.width) * 2"
							:height="parseInt(item.props.height) * 2"
							:is-description="item.props.isDescription"
							:is-time="item.props.isTime"
							:is-view-count="item.props.isViewCount"
						></dz-article>
					</view>
					
					
					<!-- 营销模块 -->
					<view v-if="marketingType.includes(item.component) && item.data.length">
						<wwj-marketing
							:props-config="item.props"
							:title="item.props.title"
							:top-bottom="parseInt(item.props.topBottom) * 2"
							:left-right="parseInt(item.props.leftRight) * 2"
							:radius="parseInt(item.props.radius) * 2"
							:cover="item.props.cover"
							:list="item.data"
							:marketingType="item.component"
							:theme="theme"
						></wwj-marketing>
					</view>
					
					<!-- 商品列表 -->
					<view v-if="item.component == 'dz-product-list'">
						<block>
							<wwj-doll-list :list="currentShowDollList" :theme="theme" @popMachineList="popMachineList"
								:radius="20"
								:left-right="35">
							</wwj-doll-list>
						</block>
						<block v-if="item.props.isLoading == 1 && index == indexComponents.length - 1">
							<dz-empty v-if="pageLoadingStatus == 'nodata'" margin-top="60" :src="empty" iconSize="360">
							</dz-empty>
							<dz-loadmore v-if="pageLoadingStatus != 'nodata'" :status="pageLoadingStatus" margin-top="20"
								margin-bottom="20"></dz-loadmore>
						</block>
					</view>
					
				</view>
			</view>
		<dz-gap :height="180"></dz-gap>
		</view>
		
		<u-popup id="gameControlPanel" :bgColor="'#f3f4f6'" duration="350" :show="showDollMachineList" round="80" mode="bottom" @close="closeDollMachineList">
			<wwj-machine-list :doll="multiMachineDoll"></wwj-machine-list>
		</u-popup>
		
		<!-- <dz-tabbar ref="dzTabbar" @clickMidButton="randomGoGame" :borderTop="false" :list="defaultTabbarList" :midButton="true" :activeColor="theme.dzBaseColor"></dz-tabbar> -->

		<!-- 返回顶部 -->
		<dz-back-top :scroll-top="scrollTop"
			:customStyle="{ background: '#fff', boxShadow: '0 2px 12px 0 rgba(0, 0, 0, 0.1)' }"
			:icon-style="{ fontSize: '36rpx' }"></dz-back-top>
		<!-- 页面加载 -->
		<dz-page-loading :show="pageLoadingShow" :status="pageLoadingStatus" zIndex="981" @click="pageLoadingClick">
		</dz-page-loading>
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex'
	import tabbarConfig from '@/core/config/tabbarConfig'
	import indexPageConfig from './indexPageConfig'
	export default {
		data() {
			return {
				title: 'Hello',
				theme: this.$api.theme,
				helper: this.$api.helper,
				defaultTabbarList: tabbarConfig.tabbarList,
				indexConfig: {},
				indexComponents: [],
				notifyAnnounce: ["全新体验,超好夹,速来体验把~~"],
				pullDownLoadingShow: false,
				pageLoadingShow: true,
				pageLoadingStatus: 'loading',
				opacity: 0,
				scrollTop: 0,
				categoriesTabs: [],
				currentShowDollList:[],
				allDollList:[],
				tabCurrent: 0,
				customNavHeight: 0,
				swiperHeight:1000,
				marketingType: ['dz-group', 'dz-wholesale', 'dz-bargain', 'dz-discount', 'dz-presale'],
				isLoadingIndexData: false,
				currentPage: 0,
				pageSize: 5,
				totalPageNum:0,
				showDollMachineList:false,
				multiMachineDoll:{}
			}
		},
		async onLoad() {
			await this.$onLaunched;
			this.customNavHeight = uni.getSystemInfoSync().statusBarHeight + 44 + 'px';
			this.pageHeight = uni.getSystemInfoSync().windowHeight;
			this.getIndexData();
		},
		onPageScroll(e) {
			// this.$api.helper.log(e.scrollTop);
			this.scrollTop = e.scrollTop;
			if (e.scrollTop <= -20 && this.pullDownLoadingShow == false) {
				this.pullDownLoadingShow = true;
				setTimeout(() => {
					this.pullDownLoadingShow = false;
				}, 1000)
			}
			/* if(this.pullDownLoadingShow && e.scrollTop == -1){
				this.pullDownLoadingShow = false;
			} */
		},
		mounted() {

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
			uni.$on("clickSelectDoll",data=>{
				console.log("selectDoll:" + data)
			});
		},
		onHide(){
			uni.$off("clickSelectDoll");
		},
		computed: {
			...mapState(['styleLoadingType','userInfo'])
		},
		onReachBottom() {
			if (this.pageLoadingStatus == 'nodata' || this.pageLoadingStatus == 'nomore') {
				return;
			}
			this.getNextPageDollList();
			// this.$refs.dollCategoriesTabs[0].reachBottom();
		},
		methods: {
			async getIndexData() {
				if (this.isLoadingIndexData == true) {
					return;
				}
				this.isLoadingIndexData = true;
				let configComponents = indexPageConfig.component;
				/* await this.$api.http.get(this.$api.apiConfig.getIndexBanner).then(res => {
					console.log(res);
					if (res.data && res.data.indexCarousel) {
						let index = configComponents.findIndex((item, i) => {
							return item.component === 'dz-swiper';
						});
						configComponents[index].props.list = res.data.indexCarousel;
					}
					if (res.data && res.data.indexAd && res.data.indexAd.length > 0) {
						let index = configComponents.findIndex((item, i) => {
							return item.component === 'dz-banner';
						});
						configComponents[index].props = res.data.indexAd[0];
					}
					if(res.data && res.data.speakerMsgs && res.data.speakerMsgs.length > 0){
						this.notifyAnnounce = [];
						res.data.speakerMsgs.forEach((item,i)=>{
							this.notifyAnnounce.push(item.title);
						});
					}
					this.indexConfig = JSON.parse(indexPageConfig.params);
					this.indexComponents = configComponents;
				}); */
				
				this.indexConfig = JSON.parse(indexPageConfig.params);
				this.indexComponents = configComponents;
				
				/* await this.$api.http.get(this.$api.apiConfig.getCategories).then(res=>{
					this.categoriesTabs = res.data;
					this.categoriesTabs.splice(0, 0, {
						id: 0,
						name: '全部'
					})
				}).catch(err=>{
					console.error(err)
				}); */
				
				await this.$api.http.get(this.$api.apiConfig.getAllDollList).then(res=>{
					this.allDollList = res.data.dollList||[];
					if(this.allDollList.length>0){
						this.totalPageNum = Math.ceil(this.allDollList.length/this.pageSize) || 1;
						this.currentPage = 0;
						this.currentShowDollList = [];
						this.currentShowDollList = this.allDollList.slice(this.currentPage*this.pageSize,(this.currentPage+1)*this.pageSize);
						this.currentPage++;
					}else{
						this.pageLoadingStatus = 'nodata';
					}
				}).catch(err=>{
					
				});
				this.pageLoadingShow = false;
			},
			getNextPageDollList(){
				this.pageLoadingStatus = 'loading';
				if(this.currentPage >= this.totalPageNum){
					this.pageLoadingStatus = 'nomore';
				}else{
					let pageData = this.allDollList.slice(this.currentPage*this.pageSize,(this.currentPage+1)*this.pageSize);
					this.currentShowDollList.push(...pageData);
					this.currentPage++;
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
			messageTap() {
				
				this.$api.router.push({
					route: this.$api.pagesConfig.message
				});
			},
			searchTap() {

			},
			noticeClick() {

			},
			swiperClick(index, event) {
				// const item = this.indexComponents[index].props.list[event];
				// console.log(item);
				// this.$api.shop.linkJump(item);
				uni.navigateTo({
					url: "/pages/audit/recharge"
				})
				
			},
			rubiksCube() {

			},
			gridAdvClick(index, event) {

			},
			banner(link) {
				uni.navigateTo({
					url: "/pages/audit/recharge"
				})
			},
			pageLoadingClick() {
				this.getInfoData();
			},
			async getInfoData() {
				this.pageLoadingShow = true;
				if (this.$api.store.getters.hasLogin) {
					// await this.getMemberInfo();
				}
			},
			reloadIndexPageData() {

			},
			initNavigation(e) {
				this.opacity = e.opacity;
			},
			opacityChange(e) {
				this.opacity = e.opacity;
			},
			sectionClick(item) {
				console.log("-------------")
				
				uni.switchTab({
					url: "/pages/main/discover/discover"
				})
				
				// this.$api.shop.linkJump(item);
			},
			popMachineList(item){
				this.showDollMachineList = true;
				this.multiMachineDoll = item;
				console.log("popDollMachineList");
			},
			randomGoGame(){
				let allMachineIds = [];
				this.allDollList.forEach((item,index)=>{
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
			closeDollMachineList(){
				this.showDollMachineList = false;
			}
		}
	}
</script>

<style lang="scss">
	page,
	.custom-page {
		height: 100%;
	}

	.custom-page {
		position: relative;

		.custom-bg-img {
			position: absolute;
			width: 100%;
			height: 100%;
			top: 0;
			left: 0;
			// background-color: #c9ffff;
		}
	}

	.z-tabs-sticky {
		position: -webkit-sticky;
		position: sticky;
		/*兼容*/
		top: 0;
	}
	.my-coin {
		color: #000000;
		font-size: 30rpx;
		font-weight: 550;
	}
	.my-coin-unit {
		color: #000000;
		font-size: 20rpx;
		font-weight: 500;
	}
	
	.bgcolor {
		background: -webkit-linear-gradient(#d3ffff, #ffffff); /* Safari 5.1 - 6.0 */
		background: -o-linear-gradient(#d3ffff, #ffffff); /* Opera 11.1 - 12.0 */
		background: -moz-linear-gradient(#d3ffff, #ffffff); /* Firefox 3.6 - 15 */
		background: linear-gradient(#d3ffff, #ffffff); /* 标准的语法（必须放在最后） */
	}
</style>
