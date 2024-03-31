<template>
	<view class="">
		<dz-sticky :customNavHeight="customNavHeight">
			<dz-tabs ref="dzTabs" :list="categories" :bgColor="$api.theme.dzBgColor" :current="tabCurrent" bar-height="8"
				:active-color="$api.theme.dzBaseColor" @change="tabChange"></dz-tabs>
		</dz-sticky>
		<dz-gap :height="8" :bg-color="$api.theme.dzBgColor"></dz-gap>
		<block>
			<!-- swiper -->
			<swiper :style="{height:swiperHeight + 'rpx'}" class="swiper" :current="tabCurrent" @transition="transition" @animationfinish="animationfinish"
				@change="onswiperchange">
				<swiper-item v-for="(categoryItem, index) in categories" :key="index">
					<wwj-doll-swiper-item ref="swiperitem" :list="dollList" :id="'swiper-item' + index" :tabIndex="index" :currentIndex="tabCurrent" :categoryId="categoryItem.id" @countHeight="countSwiperHeight"></wwj-doll-swiper-item>
				</swiper-item>
			</swiper>
		</block>
	</view>
</template>

<script>

export default{
	data(){
		return {
			customNavHeight:0,
			tabCurrent:0,
			swiperHeight:1000,
			dollList:[],
			windowHeight:0,
			tabsHeight:{},
			countHeightCnt:0,
		}
	},
	props:{
		categories:{
			type:Array,
			default(){
				return []
			}
		},
		theme: {
			type: Object,
			default() {
				return {};
			}
		},
	},
	filters:{
		
	},
	computed:{
		
	},
	methods:{
		tabChange(e) {
			this.tabCurrent = e;
			// this.swiperHeight = this.tabsHeight[this.tabCurrent]||0 + this.windowHeight;
		},
		// swiper-item左右移动，通知tabs的滑块跟随移动
		transition(e) {
			let dx = e.detail.dx;
			// this.$refs.dzTabs.setDx(dx);
		},
		animationfinish(e) {
			let current = e.detail.current;
			this.tabCurrent = current;
			// this.countSwiperHeight(current);
			// this.countSwiperHeight();
		},
		onswiperchange(e) {
			let index = e.target.current || e.detail.current;
			this.tabChange(index);
		},
		countSwiperHeight(tabIndex){
			// this.swiperHeight = this.swiperHeight+this.windowHeight;
			let element = '#swiper-item' + this.tabCurrent;
			let query = uni.createSelectorQuery().in(this);
			query.select(element).boundingClientRect();
			query.exec((res) => {
				if (res && res[0]) {
			        let height = res[0].height;
					let domHeight = Math.ceil(height/ (uni.upx2px(height) / height));
					let diffHeight = Math.abs(domHeight - this.swiperHeight);
					if(diffHeight < 50 && diffHeight != 0 && this.countHeightCnt < 2){
						this.countHeightCnt++;
						console.log("!!!!" + diffHeight);
						this.countSwiperHeight(tabIndex);
						return;
					}
					this.countHeightCnt = 0;
					this.swiperHeight = domHeight+40;
					console.log("====" + this.swiperHeight);
					if(tabIndex != undefined){
						this.tabsHeight[tabIndex] = this.swiperHeight;
					}
				}
			});
		},
		reachBottom(e){
			this.$refs.swiperitem[this.tabCurrent].reachBottom();
		},
		async getDollList(){
			await this.$api.http.get(this.$api.apiConfig.getAllDollList).then(res=>{
				this.dollList = res.data.dollList;
				this.$nextTick(function(){
					this.countSwiperHeight(0);
				})
			}).catch(err=>{
				
			});
		}
	},
	async created() {
		this.customNavHeight = uni.getSystemInfoSync().statusBarHeight + 44 + 'px';
		let wHeight = this.$api.systemInfo.windowHeight;
		this.windowHeight = Math.ceil(wHeight/(uni.upx2px(wHeight)/wHeight));
		await this.getDollList();
	},
	mounted() {
		console.log("======")
	}
}
</script>

<style>
</style>
