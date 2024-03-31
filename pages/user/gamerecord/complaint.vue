<template>
	<view class="p-3">
		<!-- #ifndef MP-TOUTIAO -->
		<dz-navbar title='提交申诉' :border-bottom="false"></dz-navbar>
		<!-- #endif -->
		<view class="shadow-lg rounded-20">
			<view class="flex j-start a-center mx-3 px-2 pt-3">
				<u--image :src="utils.formatImg(thumbnail)" width="160rpx" height="160rpx" radius="20rpx"></u--image>
				<view class="flex-column ml-2">
					<view class="flex-row">
						<text class="font-md text-gray">娃娃名称:</text>
						<text class="font-md">{{dollName}}</text>
					</view>
					<view class="flex-row">
						<text class="font-md text-gray">抓取时间:</text>
						<text class="font-md">{{createTime}}</text>
					</view>
					<view class="flex-row">
						<text class="font-md text-gray">申诉状态:</text>
						<text class="font-md">已申诉</text>
					</view>
				</view>
			</view>
			<view class="flex j-sb a-center mx-3 px-2 mt-3">
				<text class="font-md font-weight">申诉理由</text>
				<view class="flex" @click="reasonShow = true">
					<text class="font-md text-gray">{{selectReason || '请选择申诉理由'}}</text>
					<u-icon name="arrow-right"></u-icon>
				</view>
			</view>
			<view class="flex-column j-sb a-center mx-3 px-2 mt-3">
				<u--textarea v-model="content" placeholder="请详细描述下问题吧~(10-200字)" height="150rpx"></u--textarea>
				<text class="font-smd text-gray">申诉理由提交后不能修改</text>
			</view>
			
			<view class="flex j-sb a-center mx-3 px-2 mt-3 pb-5">
				<izUploaderImg ref="izUploaderImg" style="width: 100%;" @change="imgChange"></izUploaderImg>
			</view>
		</view>
		
		<u-picker :show="reasonShow" :columns="reasonList" @cancel="reasonShow = false" @confirm="confirmReason" itemHeight="60"></u-picker>
		
		<view class="position-fixed mx-5 shadow-sm" style="bottom: 120rpx;" @click="onSubmit">
			<u-button :customStyle="{width:'590rpx'}"
				text="立即提交"
				size="normal"
				color="linear-gradient(to right, rgb(255, 170, 0), rgb(217, 145, 0))"
			></u-button>
		</view>
	</view>
</template>
<script>
import izUploaderImg from '@/components/wwj-aloss-uploader-img/wwj-aloss-uploader-img.vue'
let fromRecord = false;
export default {
	components:{izUploaderImg},
	data() {
		return {
			utils:uni.$api.helper,
			recordId: '',
            thumbnail: '',
            dollName: '',
            createTime: '',
            complaintStatus: '',
			imgs: [],
			reasonShow: false,
			selectReason: '',
			content: '',
			reasonList: [
				['娃娃卡在爪子上', '视频卡顿', '按键延迟或失灵', '抓取成功提示失败', '机器硬件故障', '其他问题']
			],
        }
	},
	onLoad : function(options){
		const record = JSON.parse(options.record);
		this.recordId = record.id;
		this.thumbnail = record.thumbnail;
		this.dollName = record.dollName;
		this.createTime = record.createTime;
		this.complaintStatus = record.complaintStatus;
		fromRecord = options.fromRecord;
	},
	methods:{
		// 提交申诉
        onSubmit: function(){
			if(!this.selectReason){
				this.utils.toast('请选择申诉理由~');
				this.reasonShow = true;
				return;
			}
			
			if(!this.content || this.content.length < 10){
				this.utils.toast('请详细描述下问题吧~(10-200字)');
				return;
			}
			
			let content = this.selectReason + "," + this.content;
			
			this.$api.http.post(this.$api.apiConfig.submitComplaint, {
				recordId: this.recordId,
				content: content,
				imgs: this.imgs.join(",")
			}).then(res => {
				/* if(fromRecord){
				    this.$prePage().refresh();
				} */
				this.utils.toast('申诉提交成功');
				setTimeout(()=>{
					uni.navigateBack()
				}, 800)
			}).catch(error => {
				console.error(error);
			});
        },
		imgChange(data) {
			if(data.details){
				this.imgs = [];
				data.details.forEach((item,index) => {
					this.imgs.push(item.url);
				})
			}
		},
		confirmReason(e) {
			this.selectReason = e.value[0];
			this.reasonShow = false;
		}
	},
	onNavigationBarButtonTap(e) {
		const index = e.index;
		if (index === 0) {
			uni.navigateTo({
			    url: '/pages/user/gameRecord/gamerecord'
			});
		}
	}
}
</script>
<style lang='scss'>
	.shadow {
		box-shadow: 0 16upx 48upx rgba(114, 130, 138, 0.5)!important;
	}
	
</style>