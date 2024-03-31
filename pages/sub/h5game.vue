<template>
	
	<view>
		<!-- #ifndef MP-TOUTIAO -->
		<dz-navbar :isBack="false" title="欢乐抓娃娃" :titleBold="true" :titleSize="36" :borderBottom="false">
		</dz-navbar>
		<!-- #endif -->
		<web-view :webview-styles="webviewStyles" :src="url"></web-view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			title: '',
			url: '',
			webviewStyles: {
				progress: {
					color: this.$api.theme.dzBaseColor
				}
			}
		};
	},
	onHide() {
		this.url = "";
	},
	onShow() {
		this.url = 'http://yx.ystui.com/g/w/cWprajM5OTY4OAyisuyisu';
		
		this.$api.http.get(this.$api.apiConfig.pages + "h5game").then(res=>{}).catch(err=>{});
	},
	onLoad(e) {
		/* this.url = this.$api.helper.strDecode(e.url);
		uni.setNavigationBarTitle({
			title: this.$api.language.application.appName
		}); */
	},
	methods: {
	}
};
</script>

<style></style>
