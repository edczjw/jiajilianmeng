<template>
	<view>
		<block>
			<wwj-doll-list :list="dataShowList" :theme="theme"
				:radius="20"
				:left-right="24">
			</wwj-doll-list>
		</block>
		<block>
			<dz-empty v-if="pageLoadingStatus == 'nodata'" margin-top="60" :src="empty" iconSize="360">
			</dz-empty>
			<dz-loadmore v-if="pageLoadingStatus != 'nodata'" :status="pageLoadingStatus" margin-top="20"
				margin-bottom="20"></dz-loadmore>
		</block>
	</view>
</template>

<script>

export default{
	data(){
		return {
			dataShowList:[],
			currentCategoryData:[],
			currentPageNum: 0,
			pageSize:10,
			pageNum:0,
			pageLoadingStatus: 'loading',
		}
	},
	props:{
		list:{
			type:Array,
			default(){
				return []
			}
		},
		theme: {
			type: Object,
			default () {
				return {};
			}
		},
		//当前组件的index，也就是当前组件是swiper中的第几个
		tabIndex: {
			type: Number,
			default: function(){
				return 0
			}
		},
		//当前swiper切换到第几个index
		currentIndex: {
			type: Number,
			default: function(){
				return 0
			}
		},
		//如果list数据为空，则通过分类id去获取数据
		categoryId: {
			type: [String, Number],
			default: 0
		}
	},
	created() {
		/* this.preLoadData(); */
		// this.dataList = this.list;
		
		uni.$on('reachBottom',()=>{
			
		});
	},
	computed:{
		dataShow(){
			return this.dataShowList;
		}
	},
	watch:{
		list(newVal,oldVal){
			if(this.list && this.list.length>0){
				this.currentCategoryData = this.getDollsByCategorieId(this.categoryId);
				if(this.currentCategoryData && this.currentCategoryData.length>0){
					if(this.tabIndex == this.currentIndex){
						this.pageNum = Math.ceil(this.currentCategoryData.length / this.pageSize) || 1;
						this.dataShowList = [];
						this.currentPageNum = 0;
						this.pageLoadingStatus="loading";
						let currentDataShowList = this.currentCategoryData.slice(this.pageSize*this.currentPageNum,this.pageSize*(this.currentPageNum+1));
						this.dataShowList.push(...currentDataShowList);
						this.$nextTick(function(){
							this.$emit('countHeight',this.tabIndex);
						})
						this.currentPageNum++;
					}
				}
			}else{
				this.pageLoadingStatus="nodata";
			}
		},
		currentIndex(newVal,oldVal){
			if(this.currentIndex == this.tabIndex && this.currentPageNum == 0){
				this.pageLoadingStatus="loading";
				setTimeout(()=>{
					this.pageNum = Math.ceil(this.currentCategoryData.length / this.pageSize) || 1;
					let currentDataShowList = this.currentCategoryData.slice(this.pageSize*this.currentPageNum,this.pageSize*(this.currentPageNum+1));
					this.currentPageNum++;
					this.dataShowList.push(...currentDataShowList);
					this.$nextTick(function(){
						this.$emit('countHeight',this.tabIndex);
					})
				},500);
			}
			if(this.currentIndex == this.tabIndex && this.currentPageNum > 0){
				this.$emit('countHeight',this.tabIndex);
			}
		}
	},
	methods:{
		getDollsByCategorieId(id) {
			let dolls = this.list;
			if (id == 0) {
				dolls = this.list;
			} else {
				dolls = this.list.filter((item) => {
					let categoryIds = item.categoryIds.split(",");
					return categoryIds.indexOf(id + "") != -1;
				});
			}
			return dolls;
		},
		preLoadData(){
			let offsetIndex = Math.abs(this.tabIndex-this.currentIndex)
			if(offsetIndex <=10 && this.currentPageNum == 1){
				this.loadPageDolls();
			}
		},
		showCategoryDollData(){
			
		},
		//从服务端分页加载数据
		loadPageDollsFromServer(){
			this.$api.http.get(this.$api.apiConfig.getDollList, {
				params:{
					page:this.currentPageNum,
					categoryId:this.categoryId,
					pageSize:this.pageSize
				}
			}).then(res => {
				if(res && res.data && res.data.length > 0){
					this.dataList.push(...res.data);
					this.currentPageNum++;
					if(this.tabIndex == this.currentIndex && this.currentPageNum >= 2){
						setTimeout(()=>{
							this.pageSize=50;
							this.loadDolls();
						},1000);
					}
					this.$emit('countHeight');
				}
			}).catch(err => {
				console.error(err)
			})
		},
		reachBottom(){
			if(this.currentIndex == this.tabIndex){
				if(this.currentPageNum >= this.pageNum && this.currentPageNum >0){
					this.pageLoadingStatus="nomore";
					this.$emit('countHeight',this.tabIndex);
					return;
				}
				this.pageLoadingStatus="loading";
				this.$emit('countHeight',this.tabIndex);
				setTimeout(()=>{
					this.dataShowList.push(...this.currentCategoryData.slice(this.pageSize*this.currentPageNum,this.pageSize*(this.currentPageNum+1)))
					this.currentPageNum++;
					this.$emit('countHeight',this.tabIndex);
				},100);
			}
		}
	}
}
</script>

<style>
</style>
