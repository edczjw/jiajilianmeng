<script>
	export default {
		onLaunch: function(options) {
			//初始化应用
			this.init();
		},
		onShow: function() {
			this.checkVersionUpdate();
		},
		onHide: function() {
		},
		onError:function(err){
			//全局错误监听
			// #ifdef APP-PLUS
			plus.runtime.getProperty(plus.runtime.appid, widgetInfo => {
				const res = uni.getSystemInfoSync();
				let errMsg =
					`手机品牌：${res.brand}；手机型号：${res.model}；操作系统版本：${res.system}；客户端平台：${res.platform}；错误描述：${err}`;
				console.log('发生错误：' + errMsg);
			});
			// #endif
		},
		methods:{
			async init(){
				
				// #ifdef APP-PLUS
				// 锁定方向
				plus.screen.lockOrientation('portrait-primary');
				// // 监听推送点击事件
				// plus.push.addEventListener(
				// 	'click',
				// 	msg => {
				// 		console.log(msg)
				// 	},
				// 	false
				// );
				// // 监听在线消息事件
				// plus.push.addEventListener(
				// 	'receive',
				// 	msg => {
				// 		console.log(msg)
				// 	},
				// 	false
				// );
				// #endif
				
				uni.onTabBarMidButtonTap((e)=>{
					uni.$emit('clickMidButton');
					console.log("点击了底部导航中间按钮");
				});
				
				try{
					await this.$api.wwj.initWwjApp();
				}catch(e){
					console.log(e);
				}finally{
					setTimeout(()=>{this.$isResolve();},1000);
				}
				//完成初始化
			},
			checkVersionUpdate(){
				//#ifdef APP-PLUS
				plus.runtime.getProperty(plus.runtime.appid, (widgetInfo)=> {
					this.$api.store.commit('setClientVersion', widgetInfo.version);
					
					let param = {
						version: widgetInfo.version,
						appid: widgetInfo.appid
					}
					this.$api.http.post(this.$api.apiConfig.appVersionUpdate, param).then(res => {
						// console.log(res);
						if(res.code ==200 && res.data){
							let updateData = {};
							let updateCmd =  res.data.updateCmd || 0;
							if(updateCmd == 0){
								return;
							}
							updateData.is_enforce = updateCmd==2||updateCmd==4?1:0;
							updateData.version = res.data.version;
							updateData.content = res.data.note || "版本优化升级";
							updateData.progress = true;
							if(updateCmd==1 || updateCmd==2){
								updateData.download_url = res.data.wgtUrl;
							}
							if(updateCmd==3 || updateCmd==4){
								let sysInfo = uni.getSystemInfoSync();
								updateData.download_url = sysInfo.platform=='ios'?res.data.pkgiOSUrl:res.data.pkgAndUrl;
							}
							// console.log(updateData);
							this.$api.appUpdate(updateData);
						}
					}).catch(err=>{
						console.log(err);
					})
				});
				//#endif
			}
		}
	}
</script>

<style lang="scss">
	/* 注意要写在第一行，同时给style标签加入lang="scss"属性 */
	@import "@/uni_modules/uview-ui/index.scss";
	/* 全局样式 */
	@import '/core/main.scss';
	
	
</style>
