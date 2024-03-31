<template>
	<view class="flex-1">
		<u-navbar :autoBack="false" rightText="取消" @rightClick="cancle">
			<view class="flex a-center flex-nowrap col-10" slot="left">
				<u-search placeholder="搜索" :maxlength="10" :focus="focus" @focus="getFocus" :height="88" :value="searchValue" @change="changeKeyWord" :clearabled="false" @search="search" searchIconSize="46rpx" :bgColor="theme.dzBgColor" :showAction="false" height="58rpx" shape="square"></u-search>
			</view>
		</u-navbar>
		<u-gap :height="navBarHeight"></u-gap>
		<view class="flex flex-column" v-if="isShowHistorySearch">
			<view class="flex flex-row j-sb px-3 mt-3">
				<view class="">
					<text class="font-28" style="color: #909399;">历史搜索</text>
				</view>
				<view class="" @tap.stop="clearHistorykeywords">
					<u-icon name="trash-fill" size="46"></u-icon>
				</view>
			</view>
			<view class="flex flex-row flex-wrap px-3">
				<view class="flex px-3 mx-2 mt-3 rounded-40" style="padding-top: 5rpx;padding-bottom: 5rpx;" @tap.stop="selectKeyword(item)" :style="{backgroundColor:theme.dzBgColor}" v-for="(item,index) in historySearchDatas" :key="index">
					<text class="font-28">{{item}}</text>
				</view>
			</view>
		</view>
		<view class="mt-2" v-else>
			<wwj-doll-list :list="dollList" :theme="theme" @popMachineList="popMachineList"
				:radius="20"
				:left-right="24">
			</wwj-doll-list>
			<u-gap :height="200"></u-gap>
			<dz-empty text="亲,没有找到相关宝贝,换个关键词试试吧" v-if="dollList.length==0"></dz-empty>
		</view>
		<u-popup id="gameControlPanel" :bgColor="'#f3f4f6'" duration="350" :show="showDollMachineList" round="80" mode="bottom" @close="closeDollMachineList">
			<wwj-machine-list :doll="multiMachineDoll"></wwj-machine-list>
		</u-popup>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				theme: this.$api.theme,
				navBarHeight:0,
				contentHeight:0,
				showDollMachineList:false,
				multiMachineDoll:{},
				dollList:[],
				searchValue:'',
				isShowHistorySearch:true,
				focus:true,
				historySearchDatas:[]
			}
		},
		onLoad() {
			let statusBarH = this.$api.systemInfo.statusBarHeight;
			this.navBarHeight = this.$api.helper.px2rpx(statusBarH + 44);
			this.contentHeight = this.$api.helper.px2rpx(this.$api.systemInfo.screenHeight - statusBarH - 44);
			console.log(this.$api.store.getters.historyDollSearch);
			this.historySearchDatas = this.$api.store.getters.historyDollSearch || [];
			
		},
		methods: {
			click(){
				
			},
			cancle() {
				uni.navigateBack()
			},
			search(value){
				if(this.$api.helper.isEmpty(this.searchValue)){
					this.$api.helper.toast("关键字不能为空");
					this.focus = true;
					return;
				}
				for (let i = this.historySearchDatas.length - 1; i >= 0; i--) {
				    if (this.historySearchDatas[i] == this.searchValue) {
				        this.historySearchDatas.splice(i, 1);
				    }
				}
				this.historySearchDatas.unshift(this.searchValue);
				//最多保留10个历史搜索数据
				if(this.historySearchDatas.length > 10){
					this.historySearchDatas.slice(10,1);
				}
				this.$api.store.commit("setDollSearch",this.historySearchDatas);
				this.$api.http.get(uni.$api.apiConfig.search,{keyWord:this.searchValue}).then((res)=>{
					this.isShowHistorySearch = false;
					this.dollList = res.data;
				}).catch(err=>{
					console.log(err)
				});
			},
			popMachineList(item){
				this.showDollMachineList = true;
				this.multiMachineDoll = item;
			},
			closeDollMachineList(){
				this.showDollMachineList = false;
			},
			selectKeyword(value){
				this.searchValue = value;
				this.search();
			},
			clearValue(){
				this.searchValue = '';
			},
			changeKeyWord(value){
				this.searchValue = value;
			},
			getFocus(value){
				this.isShowHistorySearch = true;
				this.dollList = []
			},
			clearHistorykeywords(){
				this.historySearchDatas = [];
				this.$api.store.commit("setDollSearch",this.historySearchDatas);
			}
		},
	}
</script>

<style lang="scss">
	page {
		width: 100%;
		height: 100%;
		// background: #fff !important;
	}
</style>