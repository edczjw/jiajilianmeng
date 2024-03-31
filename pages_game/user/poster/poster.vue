<template>
	<view>
		<!-- #ifndef MP-TOUTIAO -->
		<dz-navbar title='邀请好友' :border-bottom="false"></dz-navbar>
		<!-- #endif -->
		
		<view class="position-relative">
			<image  src="https://oss.fszhuazhuale.com/oss/invite/invite.png" style="width: 750rpx;height: 1333rpx;"></image>
			<!-- <image :src="postPath" mode="cover" class="qrcode-box"></image> -->
			<view class="position-absolute" style="top: 1000rpx;left: 150rpx;z-index: 10;">
				<view class=" m-3 text-center p-1 rounded-20 shadow-lg font-weight"
				 style="width: 420rpx;height: 200rpx" @click="shareFc(posterList[0])"></view>
			</view>
			<!-- <view class="position-absolute" style="top: 1000rpx;left: 150rpx;z-index: 10;">
				<view
				 style="width: 420rpx;height: 200rpx" @click="share()">立即邀请</view>
			</view> -->
		</view>
		
		<view class="dz-poster-list">
			<view class="dz-poster-container">
				<view v-for="(item, index) in posterList" :key="index">
					<view class="dz-pos-item" v-show="false" hover-class="hover" :hover-start-time="150" @tap.stop="shareFc(item)">
						<image :src="item.cover" class="dz-pos-img" mode="widthFix" />
						<view class="dz-pos-content">
							<view class="dz-pos-tit">{{ item.title }}</view>
						</view>
					</view>
					<canvas
						class="hideCanvas"
						:canvas-id="'default_PosterCanvasId' + item.id"
						:id="'default_PosterCanvasId' + item.id"
						:style="{ width: item.cover_width + 'rpx', height: item.cover_height + 'rpx' }"
					></canvas>
				</view>
			</view>
		</view>
		<!--二维码-->
		<canvas class="hideCanvas" canvas-id="qrcode" style="width: 250px;height: 250px;" />
		<!-- 海报展示 -->
		<dz-poster :show="posterShow" :poster="postPath || ''" @hidePoster="hidePosterClick" @sharePoster="share"></dz-poster>
		<!-- <dz-empty v-if="loadingStatus == 'nodata'" margin-top="80" :src="empty" iconSize="360" text="暂无分享海报"></dz-empty>
		<dz-loadmore v-if="loadingStatus != 'nodata'" :status="loadingStatus" margin-top="20" margin-bottom="20"></dz-loadmore>
		<dz-toast ref="dzToast"></dz-toast> -->
	</view>
</template>

<script>
import { mapState } from 'vuex';
import uQRCode from '@/core/utils/uqrcode.js';
import painter from '@/core/utils/mp-painter';
import _app from '@/core/utils/app.js';
export default {
	data() {
		return {
			theme: this.$api.theme,
			empty: this.$api.assetsConfig.empty,
			type: '',
			posterList: [],
			qrShow: false,
			thirdPartyQrCodeImg: '', //小程序码
			wechatQrCodeImg: '', //关注公众号码
			postPath: '',
			logo: '',
			appName: '',
			loadingStatus: 'loading',
			page: 1,
			posterShow: false,
			qr_type: "common_qr",
			h5_url: ""
		};
	},
	computed: {
		...mapState(['userInfo'])
	},
	async onLoad(option) {
		await this.$onLaunched;
		await this.getInviteUrl();
		
		this.logo = this.$api.assetsConfig.wwjChLogo;
		this.appName = "夹机联盟";
		this.getDistributionPosterIndex();
		// this.shareFc1(this.posterList[0])
		// this.shareFc(this.posterList[0]);
	},
	onPullDownRefresh() {
		this.page = 1;
		this.posterList.length = 0;
		this.getDistributionPosterIndex();
	},
	onReachBottom() {
		if (this.loadingStatus == 'nomore') return;
		this.page++;
		this.getDistributionPosterIndex();
	},
	methods: {
		async getInviteUrl() {
			this.$api.http.get(this.$api.apiConfig.getInviteUrl).then(res=>{
				console.log(res);
				this.h5_url = res.msg;
			}).catch(err=>{
				console.log(err);
			})
		},
		getDistributionPosterIndex() {
			this.loadingStatus = 'loading';
			
			let res = {
				"code": 200,
				"message": "OK",
				"data": [{
					"id": "2",
					"title": "wwj",
					"cover": "https://oss.fszhuazhuale.com/imgs/wwj/share.jpg",
					"cover_width": "750",
					"cover_height": "1344",
					"component": "{\"head_startUsing\":0,\"circularBead\":20,\"head_portrait_size\":60,\"head_portrait_x\":20,\"head_portrait_y\":20,\"nickname_size\":14,\"nickname_color\":\"#333\",\"nickname_bold\":0,\"qrcode_startUsing\":1,\"qrcode_x\":150,\"qrcode_y\":250,\"qrcode_size\":170,\"text_startUsing\":0,\"text\":\"我为YYDShop代言\",\"text_color\":\"#333\",\"text_size\":22,\"text_bold\":0,\"text_x\":36,\"text_y\":220,\"store_status\":0,\"store_logo_size\":60,\"store_border_radius\":10,\"store_logo_x\":20,\"store_logo_y\":570,\"store_name\":\"YYDShop\",\"store_name_x\":97,\"store_name_y\":587,\"store_name_size\":22,\"store_name_color\":\"#333\",\"store_name_bold\":0}",
					"share_times": "0",
					"sort": "999",
					"status": "1",
					"created_at": "1650641276",
					"updated_at": "1650641276"
				}],
				"conf": "952e5cd3d5b922ed144f7417e32211c6",
				"ver": "1.0.0",
				"timestamp": 1650641522
			}
			this.loadingStatus = res.data.length == this.$api.appConfig.pageSize ? 'loadmore' : 'nomore';
			this.posterList = [...this.posterList, ...res.data];
			if (this.page == 1 && res.data.length == 0) {
				this.loadingStatus = 'nodata';
			}
			
			uni.stopPullDownRefresh();
			// this.shareFc(this.posterList[0]);
		},
		async shareFc(item) {
			item = this.posterList[0];
			console.log("===========================================shareFc");
			console.log(item);
			
			uni.showLoading({
				mask: true,
				title: this.$api.language.product.posterCreating
			});

			let bg = item.cover;
			let diyStyle = JSON.parse(item.component);
			let qrsize = parseInt(diyStyle.qrcode_size) * 2;
			let qrx = parseInt(diyStyle.qrcode_x) * 2;
			let qry = parseInt(diyStyle.qrcode_y) * 2;
			let nickname = this.userInfo.nickname || this.userInfo.realname;
			let avatar = (this.userInfo && this.userInfo.head_portrait) || this.logo;
			let logo = this.logo;
			let storeName = this.appName;

			// let wxLink = this.$api.appConfig.indexPath;
			let wxLink = "/pages/main/index/index";
			if (wxLink.startsWith('/')) {
				wxLink = wxLink.substr(1);
			}
			if (wxLink.endsWith('/')) {
				wxLink = wxLink.substr(0, wxLink.length - 1);
			}
			if (this.$api.store.getters.hasLogin) {
				wxLink = wxLink + '?promo_code=' + this.$api.store.state.userInfo.promo_code;
			}
			wxLink = encodeURIComponent(wxLink);

			let qrcode;
			if (this.qr_type == 'mini_program_qr') {
				if (!this.thirdPartyQrCodeImg) {
					await this.$api.http
						.get(this.$api.apiShop.thirdPartyWechatQrCode, {
							params: {
								link: wxLink
							}
						})
						.then(res => {
							this.thirdPartyQrCodeImg = res.data.url;
						})
						.catch(err => {});
				}
				qrcode = this.thirdPartyQrCodeImg;
			} else if (this.qr_type == 'wechat_qr') {
				//公众号二维码
				if (!this.wechatQrCodeImg) {
					await this.$api.http
						.get(this.$api.apiShop.thirdPartyWechatOfficialQrCode)
						.then(res => {
							this.wechatQrCodeImg = res.data.url;
						})
						.catch(err => {});
				}
				qrcode = this.wechatQrCodeImg;
			} else {
				let domain = this.h5_url;
				if (domain.endsWith('/')) {
					domain = domain.substr(0, domain.length - 1);
				}
				qrcode = await new Promise((resolve, reject) => {
					uQRCode.make({
						canvasId: 'qrcode',
						componentInstance: this,
						text: `${domain}?promo_code=${this.$api.store.state.userInfo.promo_code}`,
						size: 250,
						margin: 10,
						backgroundColor: '#ffffff',
						foregroundColor: '#000000',
						fileType: 'jpg',
						correctLevel: uQRCode.defaults.correctLevel,
						success: res => {
							resolve(res);
						},
						fail: res => {
							reject(res);
						}
					});
				});
			}

			try {
				await new painter(uni.createCanvasContext('default_PosterCanvasId' + item.id)).draw({
					type: 'container',
					top: 0,
					left: 0,
					children: [
						{ type: 'image', top: 0, width: item.cover_width, height: item.cover_height, src: bg },
						{
							type: 'clip',
							position: 'absolute',
							top: parseInt(diyStyle.head_portrait_y) * 2,
							left: parseInt(diyStyle.head_portrait_x) * 2,
							path: {
								type: 'rounded-rect',
								width: parseInt(diyStyle.head_portrait_size) * 2,
								height: parseInt(diyStyle.head_portrait_size) * 2,
								borderRadius: parseInt(diyStyle.circularBead) * 2
							},
							content: {
								type: 'image',
								width: parseInt(diyStyle.head_portrait_size) * 2,
								height: parseInt(diyStyle.head_portrait_size) * 2,
								src: diyStyle.head_startUsing == 1 ? avatar : ''
							}
						},
						{
							type: 'clip',
							position: 'absolute',
							top: parseInt(diyStyle.store_logo_y) * 2,
							left: parseInt(diyStyle.store_logo_x) * 2,
							path: {
								type: 'rounded-rect',
								width: parseInt(diyStyle.store_logo_size) * 2,
								height: parseInt(diyStyle.store_logo_size) * 2,
								borderRadius: parseInt(diyStyle.store_border_radius) * 2
							},
							content: {
								type: 'image',
								width: parseInt(diyStyle.store_logo_size) * 2,
								height: parseInt(diyStyle.store_logo_size) * 2,
								src: diyStyle.store_status == 1 ? logo : ''
							}
						},
						{ type: 'image', position: 'absolute', top: qry, left: qrx, width: qrsize, height: qrsize, src: diyStyle.qrcode_startUsing == 1 ? qrcode : '' },
						{
							type: 'text',
							position: 'absolute',
							top: diyStyle.head_portrait_y * 2 + diyStyle.head_portrait_size - diyStyle.nickname_size,
							left: diyStyle.head_portrait_size * 2 + 20 + diyStyle.head_portrait_x * 2,
							fontSize: diyStyle.nickname_size * 2,
							fontWeight: diyStyle.nickname_bold == 1 ? 'bold' : '400',
							color: diyStyle.nickname_color,
							content: diyStyle.head_startUsing == 1 ? '我是 ' + nickname : ''
						},
						{
							type: 'text-block',
							position: 'absolute',
							width: item.cover_width - diyStyle.text_x * 2,
							lineHeight: diyStyle.text_size * 2 + 12,
							top: diyStyle.text_y * 2,
							left: diyStyle.text_x * 2,
							fontSize: diyStyle.text_size * 2,
							fontWeight: diyStyle.text_bold == 1 ? 'bold' : '400',
							content: diyStyle.text_startUsing == 1 ? diyStyle.text : '',
							color: diyStyle.text_color
						},
						{
							type: 'text-block',
							position: 'absolute',
							width: item.cover_width - diyStyle.store_name_x * 2,
							lineHeight: diyStyle.store_name_size * 2 + 12,
							top: diyStyle.store_name_y * 2,
							left: diyStyle.store_name_x * 2,
							fontSize: diyStyle.store_name_size * 2,
							fontWeight: diyStyle.store_name_bold == 1 ? 'bold' : '400',
							content: diyStyle.store_status == 1 ? storeName : '',
							color: diyStyle.store_name_color
						}
					]
				});

				// console.log("==================================================uni.canvasToTempFilePath");
				uni.canvasToTempFilePath({
					canvasId: 'default_PosterCanvasId' + item.id,
					success: res => {
						console.log(res);
						this.postPath = res.tempFilePath;
						this.share();
						setTimeout(() => {
							this.posterShow = true;
						}, 100);
						uni.hideLoading();
					},
					fail: e => {
						console.log(e);
						this.$refs.dzToast.show({
							title: this.$api.language.product.posterCreateImageError,
							type: 'warning'
						});
						uni.hideLoading();
					}
				});
			} catch (e) {
				console.log(e, JSON.stringify(e));
				this.$refs.dzToast.show({
					title: this.$api.language.product.posterCreateError,
					type: 'warning'
				});
				uni.hideLoading();
			}
		},
		async shareFc1(item) {
			item = this.posterList[0];
			console.log("===========================================shareFc");
			console.log(item);
			
			uni.showLoading({
				mask: true,
				title: this.$api.language.product.posterCreating
			});
		
			let bg = item.cover;
			let diyStyle = JSON.parse(item.component);
			let qrsize = parseInt(diyStyle.qrcode_size) * 2;
			let qrx = parseInt(diyStyle.qrcode_x) * 2;
			let qry = parseInt(diyStyle.qrcode_y) * 2;
			let nickname = this.userInfo.nickname || this.userInfo.realname;
			let avatar = (this.userInfo && this.userInfo.head_portrait) || this.logo;
			let logo = this.logo;
			let storeName = this.appName;
		
			// let wxLink = this.$api.appConfig.indexPath;
			let wxLink = "/pages/main/index/index";
			if (wxLink.startsWith('/')) {
				wxLink = wxLink.substr(1);
			}
			if (wxLink.endsWith('/')) {
				wxLink = wxLink.substr(0, wxLink.length - 1);
			}
			if (this.$api.store.getters.hasLogin) {
				wxLink = wxLink + '?promo_code=' + this.$api.store.state.userInfo.promo_code;
			}
			wxLink = encodeURIComponent(wxLink);
		
			let qrcode;
			if (this.qr_type == 'mini_program_qr') {
				if (!this.thirdPartyQrCodeImg) {
					await this.$api.http
						.get(this.$api.apiShop.thirdPartyWechatQrCode, {
							params: {
								link: wxLink
							}
						})
						.then(res => {
							this.thirdPartyQrCodeImg = res.data.url;
						})
						.catch(err => {});
				}
				qrcode = this.thirdPartyQrCodeImg;
			} else if (this.qr_type == 'wechat_qr') {
				//公众号二维码
				if (!this.wechatQrCodeImg) {
					await this.$api.http
						.get(this.$api.apiShop.thirdPartyWechatOfficialQrCode)
						.then(res => {
							this.wechatQrCodeImg = res.data.url;
						})
						.catch(err => {});
				}
				qrcode = this.wechatQrCodeImg;
			} else {
				let domain = this.h5_url;
				if (domain.endsWith('/')) {
					domain = domain.substr(0, domain.length - 1);
				}
				qrcode = await new Promise((resolve, reject) => {
					uQRCode.make({
						canvasId: 'qrcode',
						componentInstance: this,
						text: `${domain}?promo_code=${this.$api.store.state.userInfo.promo_code}`,
						size: 250,
						margin: 10,
						backgroundColor: '#ffffff',
						foregroundColor: '#000000',
						fileType: 'jpg',
						correctLevel: uQRCode.defaults.correctLevel,
						success: res => {
							resolve(res);
						},
						fail: res => {
							reject(res);
						}
					});
				});
			}
		
			try {
				await new painter(uni.createCanvasContext('default_PosterCanvasId' + item.id)).draw({
					type: 'container',
					top: 0,
					left: 0,
					// children: [
					// 	// { type: 'image', top: 0, width: item.cover_width, height: item.cover_height, src: bg },
					// 	{ type: 'image', top: 0, width: item.cover_width, height: item.cover_height, src: diyStyle.qrcode_startUsing == 1 ? qrcode : '' },
					// ],
					children: [
						{ type: 'image', top: 0, width: item.cover_width, height: item.cover_height, src: bg },
						{
							type: 'clip',
							position: 'absolute',
							top: parseInt(diyStyle.head_portrait_y) * 2,
							left: parseInt(diyStyle.head_portrait_x) * 2,
							path: {
								type: 'rounded-rect',
								width: parseInt(diyStyle.head_portrait_size) * 2,
								height: parseInt(diyStyle.head_portrait_size) * 2,
								borderRadius: parseInt(diyStyle.circularBead) * 2
							},
							content: {
								type: 'image',
								width: parseInt(diyStyle.head_portrait_size) * 2,
								height: parseInt(diyStyle.head_portrait_size) * 2,
								src: diyStyle.head_startUsing == 1 ? avatar : ''
							}
						},
						{
							type: 'clip',
							position: 'absolute',
							top: parseInt(diyStyle.store_logo_y) * 2,
							left: parseInt(diyStyle.store_logo_x) * 2,
							path: {
								type: 'rounded-rect',
								width: parseInt(diyStyle.store_logo_size) * 2,
								height: parseInt(diyStyle.store_logo_size) * 2,
								borderRadius: parseInt(diyStyle.store_border_radius) * 2
							},
							content: {
								type: 'image',
								width: parseInt(diyStyle.store_logo_size) * 2,
								height: parseInt(diyStyle.store_logo_size) * 2,
								src: diyStyle.store_status == 1 ? logo : ''
							}
						},
						{ type: 'image', position: 'absolute', top: qry, left: qrx, width: qrsize, height: qrsize, src: diyStyle.qrcode_startUsing == 1 ? qrcode : '' },
						{
							type: 'text',
							position: 'absolute',
							top: diyStyle.head_portrait_y * 2 + diyStyle.head_portrait_size - diyStyle.nickname_size,
							left: diyStyle.head_portrait_size * 2 + 20 + diyStyle.head_portrait_x * 2,
							fontSize: diyStyle.nickname_size * 2,
							fontWeight: diyStyle.nickname_bold == 1 ? 'bold' : '400',
							color: diyStyle.nickname_color,
							content: diyStyle.head_startUsing == 1 ? '我是 ' + nickname : ''
						},
						{
							type: 'text-block',
							position: 'absolute',
							width: item.cover_width - diyStyle.text_x * 2,
							lineHeight: diyStyle.text_size * 2 + 12,
							top: diyStyle.text_y * 2,
							left: diyStyle.text_x * 2,
							fontSize: diyStyle.text_size * 2,
							fontWeight: diyStyle.text_bold == 1 ? 'bold' : '400',
							content: diyStyle.text_startUsing == 1 ? diyStyle.text : '',
							color: diyStyle.text_color
						},
						{
							type: 'text-block',
							position: 'absolute',
							width: item.cover_width - diyStyle.store_name_x * 2,
							lineHeight: diyStyle.store_name_size * 2 + 12,
							top: diyStyle.store_name_y * 2,
							left: diyStyle.store_name_x * 2,
							fontSize: diyStyle.store_name_size * 2,
							fontWeight: diyStyle.store_name_bold == 1 ? 'bold' : '400',
							content: diyStyle.store_status == 1 ? storeName : '',
							color: diyStyle.store_name_color
						}
					]
				});
		
				// console.log("==================================================uni.canvasToTempFilePath");
				uni.canvasToTempFilePath({
					canvasId: 'default_PosterCanvasId' + item.id,
					success: res => {
						console.log(res);
						this.postPath = res.tempFilePath;
						uni.hideLoading();
					},
					fail: e => {
						console.log(e);
						this.$refs.dzToast.show({
							title: this.$api.language.product.posterCreateImageError,
							type: 'warning'
						});
						uni.hideLoading();
					}
				});
			} catch (e) {
				console.log(e, JSON.stringify(e));
				this.$refs.dzToast.show({
					title: this.$api.language.product.posterCreateError,
					type: 'warning'
				});
				uni.hideLoading();
			}
		},
		//隐藏海报
		hidePosterClick() {
			this.posterShow = false;
		},
		async getQrcode() {
			if (this.shopSetting.product_poster_qr_type == 'common_qr') {
				let domain = this.h5_url;
				if (domain.endsWith('/')) {
					domain = domain.substr(0, domain.length - 1);
				}
				return new Promise((resolve, reject) => {
					uQRCode.make({
						canvasId: 'qrcode',
						componentInstance: this,
						text: `${domain}?promo_code=${this.$api.store.state.userInfo.promo_code}`,
						size: 250,
						margin: 10,
						backgroundColor: '#ffffff',
						foregroundColor: '#000000',
						fileType: 'jpg',
						correctLevel: uQRCode.defaults.correctLevel,
						success: res => {
							resolve(res);
						},
						fail: res => {
							reject(res);
						}
					});
				});
			} else if (this.shopSetting.product_poster_qr_type == 'wechat_qr') {
				//公众号二维码
				if (!this.wechatQrCodeImg) {
					await this.$api.http
						.get(this.$api.apiShop.thirdPartyWechatOfficialQrCode)
						.then(res => {
							this.wechatQrCodeImg = res.data.url;
							return this.wechatQrCodeImg;
						})
						.catch(err => {});
				} else {
					return this.wechatQrCodeImg;
				}
			}
		},
		saveImage() {
			// #ifndef H5
			uni.saveImageToPhotosAlbum({
				filePath: this.postPath,
				success(res) {
					_app.showToast('保存成功');
				}
			});
			// #endif
			// #ifdef H5
			_app.showToast('请长按上方图片保存');
			// #endif
		},
		share() {
			// #ifdef APP-PLUS
			console.log("-----------------------------share");
			console.log("==========================postPath="+this.postPath);
			_app.getShare(false, false, 2, '', '', '', this.postPath, false, false);
			// #endif

			// #ifndef APP-PLUS
			_app.showToast('请长按图片保存后自行分享');
			// #endif
		},
		hideQr() {
			this.qrShow = false;
		}
	}
};
</script>

<style lang="scss" scoped>
.dz-poster-list {
	display: flex;
	justify-content: space-between;
	flex-direction: row;
	flex-wrap: wrap;
	box-sizing: border-box;
	margin: 20rpx 20rpx;
}

.dz-poster-container {
	flex: 1;
	margin-right: 20rpx;
}

.dz-poster-container:last-child {
	margin-right: 0;
}

.dz-pos-item {
	width: 100%;
	margin-bottom: 20rpx;
	background: #fff;
	box-sizing: border-box;
	border-radius: 20rpx;
	overflow: hidden;
	transition: all 0.15s ease-in-out;
}

.dz-pos-img {
	width: 100%;
	display: block;
}

.dz-pos-content {
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	box-sizing: border-box;
	padding: 20rpx;
}

.dz-pos-tit {
	color: $dz-main-color;
	font-size: 26rpx;
	word-break: break-all;
	overflow: hidden;
	text-overflow: ellipsis;
	display: -webkit-box;
	-webkit-box-orient: vertical;
	-webkit-line-clamp: 2;
}

/*海报*/

.hideCanvas {
	position: fixed;
	top: -99999upx;
	left: -99999upx;
	z-index: -99999;
}
.qrcode-box {
	position: absolute;
	z-index: 9;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	// background: #FFF;
}
</style>
