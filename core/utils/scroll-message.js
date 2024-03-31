/* message:{
	nick:'',玩家昵称
	doll:null,夹中娃娃
	cnt:0,夹中次数
} */
export default {
	view: null,
	pxToRpxScale:0,
	windowWidth:0,
	messages:[],
	isScrolling:false,
	platform:uni.getSystemInfoSync().platform,
	currentMessage:null,
	initComponent(){
		let systemInfo = uni.getSystemInfoSync()
		this.windowWidth = systemInfo.windowWidth;
		// px转换到rpx的比例
		let pxToRpxScale = 750 / this.windowWidth;
		this.pxToRpxScale = pxToRpxScale;
		let left = this.platform=='ios'?uni.upx2px(750):5;
		let distance = uni.upx2px(750);
		this.view = new plus.nativeObj.View('scrollMsg', {
			top: 100 + 'px',
			left: 5 + 'px',
			height: 60/pxToRpxScale + 'px',
			width: (this.windowWidth - 10) + 'px',
		});
		this.view.addEventListener("click", (e)=>{
			if(this.currentMessage){
				// console.log(this.currentMessage);
			}
		}, false);
		
	},
	onClick(e){
		
	},
	push(message){
		this.messages.push(message);
		this.start();
	},
	start(){
		if(this.isScrolling){
			return
		}
		if(!this.view){
			this.initComponent();
		}
		this.isScrolling = true;
		this.scrollMessage();
	},
	scrollMessage(){
		let message = this.messages.shift();
		if(!message){
			this.isScrolling=false;
			return
		}
		this.currentMessage = message;
		this.initComponent();
		this.view.drawRect({
				color: '#b18eb1',
				size: '90%',
				radius: '15px',
				borderWidth: '2px',
				borderColor: '#b189af'
			})	
		let fontSize = this.platform=='android'?'14px':'16px';
		
		let richText = `<font color='#FFFFFF' style='font-size:${fontSize};'>恭喜 </font>`;
		richText += `<font color='#ffff00' style='font-size:${fontSize};font-weight:900;'>`+ message.nick +"</font>";
		richText += `<font color='#FFFFFF' style='font-size:${fontSize};'> 成功抓到了 </font>`
		if(message.dollImg){
			let dollImg = uni.$api.helper.formatImg(message.dollImg);
			richText += `<img src='${dollImg}' width='${uni.upx2px(40)}' height='${uni.upx2px(40)}' style='border-radius:10px'></img>`
		}
		richText += `<font color='#ffff00' style='font-size:${fontSize};font-weight:900;'> `+ message.dollName +"</font>"
		let topH = this.platform=='android'?'2px':'5px'
		this.view.drawRichText(richText, {top:topH,left:'12px',width:'100%',height:'wrap_content'},{
				align: 'left'
			})
			
		let isComplete = false;
		plus.nativeObj.View.startAnimation({type:'pop-in',duration:3000},this.view,null,()=>{
			// console.log('plus.nativeObj.View.startAnimation动画结束');
			// 延时500ms关闭原生动画
			setTimeout(()=>{
				isComplete = true;
				plus.nativeObj.View.clearAnimation();
				this.scrollMessage();
				
			},1000);
		});
		setTimeout(()=>{
			if(!isComplete){
				plus.nativeObj.View.clearAnimation();
				this.scrollMessage();
			}
		},4100);
		/* if(this.platform == 'android'){
			
		}else{
			this.view.show();
			this.moveIn();
		} */
	},
	moveIn(){
		let distance = uni.upx2px(750);
		let time=0;
		let iTask = setInterval(()=>{
			time = time+1;
			let x = distance - (distance/2000) * time
			this.view.setStyle({  
				left: x + 'px'  
			});  
			if(time >= 2000){
				clearInterval(iTask);
				setTimeout(()=>{
					this.moveOut();
				},800)
			}
		},1)
	},
	moveOut(){
		let distance = uni.upx2px(750);
		let time=0;
		let iTask = setInterval(()=>{
			time = time+1;
			let x = 0 - (distance/2000) * time
			this.view.setStyle({  
				left: x + 'px'  
			});  
			if(time >= 2000){
				clearInterval(iTask);
				this.view.hide();
				this.scrollMessage();
			}
		},1)
	}
}