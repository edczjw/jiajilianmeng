<template>
	<view class="mx-5">
		<!-- #ifndef MP-TOUTIAO -->
		<dz-navbar title='口令红包' :border-bottom="false"></dz-navbar>
		<!-- #endif -->
		
		<dz-gap :height="30"></dz-gap>
		
		<u--input style="height: 80rpx;" v-model="pwd" fontSize="16px" placeholder="请输入口令,兑换福利" border="surround" inputAlign="center"></u--input>
		
		<dz-gap :height="30"></dz-gap>
		
		<view class="m-3 text-center p-1 rounded-20 shadow-lg font-weight" style="color: white;background-color: #fe8e2e;" @click="confirm">立即提交</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				pwd:''
			}
		},
		onLoad(){
		},
		methods: {
			//提交
			confirm(){
				if(!this.pwd){
				    uni.showToast({
				    	title: '请输入口令',
				    	icon: 'none'
				    });
					return;
				}
				
				this.$api.http.post(this.$api.apiConfig.exchangePwd,{
					pwd:this.pwd,
				}).then(res=>{
					this.pwd = '';
					uni.showToast({
						title: res.msg,
						icon: 'none',
						duration: 2000
					});
				}).catch(err=>{
					console.error(err);
				});
			},
		}
	}
</script>
