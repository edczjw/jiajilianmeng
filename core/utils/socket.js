import $mAppConfig from '@/core/config/appConfig'
import $mHelper from '@/core/utils/helper'
import $mStore from '@/store';
import $mSocketioConfig from '@/core/config/socketioConfig'
import socketio from '@/core/utils/uni-socketio/uni-socket.io'
import scrollMessage from '@/core/utils/scroll-message'
import $mResponseCode from '../config/responseCode';

class Socket{
	constructor(){
		this.connected=false;
		this.isConnecting= false;
		this.$socket=null;
		this.socketId='';
		this.reConnectCnt=0;
	}
	
	reSet(){
		this.connected=false;
		this.isConnecting= false;
		this.$socket=null;
		this.socketId='';
	}
	
	initSocket(){
		if(this.connected || this.isConnecting){
			$mHelper.log('已连接或正在连接中...')
			return
		}
		this.isConnecting = true;
		let serverConf = $mStore.state.serverConf;
		if($mHelper.isEmpty(serverConf)){
			serverConf = uni.getStorageSync("serverConf");
		}
		//serverConf.server = "http://192.168.3.2:9011/";
		const S = socketio(serverConf.server,{
				query: {},
				transports:['websocket'],
				timeout:2000
			})
		
		S.on('connect',()=>{
			$mHelper.log('socket connected')
			this.connected=true;
			this.isConnecting  = false;
			this.$socket = S;
			this.socketId=S.id;
			if($mStore.state.accessToken){
				//玩家如果已经登陆过，网络再次重连必须得再登陆
				$mStore.dispatch("socketLogin");
			}
			uni.$emit("socketConnect");
		})
		
		// 监听失败
		S.on('error',()=>{
			this.reSet();
			$mHelper.log('连接失败');
		})
		// 监听断开
		S.on('disconnect',()=>{
			this.reSet();
			$mHelper.log('连接断开');
		})
		S.on('reconnecting', (data)=>{
			$mHelper.log('正在重连...' + data)
		});
		S.on('connect_error', (data)=>{
		    $mHelper.log(data + ' - connect_error');
			if(this.reConnectCnt > 10){
				S.close();
				this.reSet();
				uni.showModal({
					title:"提示",
					content:"连接服务器失败",
					showCancel:false,
					success: (res) => {
						$mStore.dispatch("logout");
					}
				})
			}
		});
		S.on('connect_timeout', (data)=>{
		    $mHelper.log(data + ' - connect_timeout');
		});
		S.on('reconnect', (data)=>{
		});
		S.on('reconnect_attempt', (data)=>{
			this.reConnectCnt=data;
			if(data%5===0){
				//重新获取服务器连接地址，进行重连
				
			}
		});
		S.on('reconnect_error', (data)=>{
		    $mHelper.log(data + ' - reconnect_error');
		});
		
		S.on('reconnect_failed', (data)=>{
		    $mHelper.log(data + ' - reconnect_failed');
		});
		S.on('ping', (data)=>{
			//发送心跳包
			this.send($mSocketioConfig.heartbeat,{},res=>{
				let localTimestamp = parseInt(new Date().getTime()/1000);
				let offsetTime = Number(res.timestamp) - Number(localTimestamp);
				$mStore.commit("setOffsetTime",offsetTime);
			});
		});
		S.on('pong', (data)=>{
		});
		//服务端踢人下线
		this.on($mSocketioConfig.pushKickout, (res)=>{
			this.reSet();
		});
		
		//全局飘字
		S.on($mSocketioConfig.scrollMessage,(e)=>{
			let message = {
				nick:e.userNick,
				dollName:e.dollName
			}
			scrollMessage.push(message);
		});
	}
	
	send(protoId,reqData,callback=null){
		if(this.$socket){
			if(callback && typeof callback ==='function'){
				this.$socket.once("" + protoId, (res)=>{
					if(res && res.rtnCode == $mResponseCode.accountValidationFailedCode){
						$mStore.state.socketHadLogin = false;
						$mStore.dispatch("socketLogin");
					}
					callback(res);
				})
			}
			this.$socket.emit(""+protoId, reqData);
			// $mHelper.log("客户端端发送了,socket protoId:" + protoId);
		}
	}
	
	on(protoId, callback){
		if(this.$socket){
			if($mHelper.isEmpty(protoId) || $mHelper.isEmpty(callback)){
				return;
			}
			this.$socket.on('' + protoId, (res)=>{
				// $mHelper.log(this.socketId + ",socket protoId:" + protoId + " 执行了回调");
				callback(res);
			});
		}
	}
	
	off(protoId){
		if(this.$socket){
			if(!$mHelper.isEmpty(protoId)){
				this.$socket.off(''+protoId)
			}
		}
	}
}

export default new Socket()