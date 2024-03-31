<template>
	<view class="dz-m-15">
		<view class="ql-container">
			<view class="ql-editor">
				<mp-html :content="html" />
			</view>
		</view>
	</view>
</template>
<script>
export default {
	data() {
		return {
			title   : "",
			html: ''
		}
	},
	onLoad : function(options){
		this.getArticle(options.id);
	},
	methods: {
		getArticle(id) {
			this.$api.http.get(this.$api.apiConfig.getArticle + id)
			.then(res => {
				if(res.code == 200){
					uni.setNavigationBarTitle({
					    title: res.data.noticeTitle
					});
					
					this.html = res.data.noticeContent;
				}else {
					uni.showToast({
						title: '文章不存在',
						icon: 'none'
					});
					setTimeout(function() {
						uni.navigateBack();
					}, 500);
				}
			})
		}
	}
}
</script>
<style>
	@import '@/core/css/quill/quill.bubble.css';
	@import '@/core/css/quill/quill.core.css';
	@import '@/core/css/quill/quill.snow.css';
</style>